import * as SecureStore from "expo-secure-store";
import { domain } from "../constants/network";
import { Formik } from "formik";
import React from "react";
import { Alert, ScrollView, View } from "react-native";
import { Button, Div, Text } from "react-native-magnus";
import { InputField, LargeButton } from "../components/formComponents";

async function submitForm(data) {
  data.username = data.username.trim();
  data.email = data.email.trim();
  data.first_name = data.first_name.trim();
  data.last_name = data.last_name.trim();
  data.phone_number = data.phone_number.trim();

  const response = await fetch(domain + "/api/user/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json = await response.json();

  if (json.status !== "OK") {
    console.log(json.status);
    return json.status;
  }

  await SecureStore.setItemAsync("token", json.token);

  return json.status;
}

function RegisterForm() {
  return (
    <Formik
      initialValues={{
        username: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        phoneNumber: "",
      }}
      validate={(values) => console.log("Validation function")}
      onSubmit={async (values, { setSubmitting }) => {
        const status = await submitForm(values);
        if (status !== "OK") {
          Alert.alert(
            "Nie można zarejestrować",
            `Wystąpił błąd podczas próby rejestracji, odpowiedź serwera: ${status}`,
            [{ text: "OK", onPress: () => console.log("OK Pressed") }],
            { cancelable: true }
          );
        }else{
          console.log("TODO: redirect after successfull register");
        }
      }}
    >
      {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
        <Div>
          <InputField name="username" handler={handleChange("username")} />
          <InputField
            name="password"
            handler={handleChange("password")}
            secure
          />
          <InputField name="email" handler={handleChange("email")} />
          <InputField name="firstName" handler={handleChange("first_name")} />
          <InputField name="lastName" handler={handleChange("last_name")} />
          <InputField
            name="phoneNumber"
            handler={handleChange("phone_number")}
          />
          <LargeButton onPress={handleSubmit}>Zarejestruj</LargeButton>
        </Div>
      )}
    </Formik>
  );
}
export default class RegisterScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <Text mt={10} fontSize="lg" fontWeight="bold">
          Zarejestruj
        </Text>
        <ScrollView style={{ flex: 1 }}>
          <RegisterForm />
        </ScrollView>
      </View>
    );
  }
}
