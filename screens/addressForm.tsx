import { Formik } from "formik";
import React from "react";
import { Alert, View } from "react-native";
import { Div, Input, Text } from "react-native-magnus";
import { InputField, LargeButton } from "../components/formComponents";
import { domain } from "../constants/network";
import * as SecureStore from "expo-secure-store";

async function submitForm(data) {
  data.city = data.city.trim();
  data.postal_code = data.postal_code.trim();
  data.street_address = data.street_address.trim();

  const token = await SecureStore.getItemAsync("token");

  if (!token) {
    return { status: "ERR_TOKEN_LOCAL" };
  }

  const response = await fetch(domain + "/api/user/add-address", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: token,
    },
    body: JSON.stringify(data),
  });

  const json = await response.json();

  if (json.status !== "OK") {
    console.log(json.status);
    return json.status;
  }

  return json.status;
}

function AddressForm() {
  return (
    <Formik
      initialValues={{ city: "", postal_code: "", street_address: "" }}
      validate={(values) => console.log("Validation function")}
      onSubmit={async (values, { setSubmitting }) => {
        const status = await submitForm(values);
        if (status !== "OK") {
          Alert.alert(
            "Nie można dodać adresu",
            `Wystąpił błąd podczas próby dodania adresu, odpowiedź serwera: ${status}`,
            [{ text: "OK", onPress: () => console.log("OK Pressed") }],
            { cancelable: true }
          );
        } else {
          console.log("TODO: Redirect to user page");
        }
      }}
    >
      {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
        <Div>
          <InputField name="Ulica" handler={handleChange("street_address")} />
          <InputField
            name="Kod pocztowy"
            handler={handleChange("postal_code")}
          />
          <InputField name="Miasto" handler={handleChange("city")} />
          <LargeButton onPress={handleSubmit}>Dodaj adres...</LargeButton>
        </Div>
      )}
    </Formik>
  );
}
export default class AddressScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <Text mt={10} fontSize="lg" fontWeight="bold">
          Dodaj adres
        </Text>
        <AddressForm />
      </View>
    );
  }
}
