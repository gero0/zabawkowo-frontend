import { Formik } from "formik";
import React from "react";
import { Alert, View } from "react-native";
import { Div, Text } from "react-native-magnus";
import { InputField, LargeButton } from "../components/formComponents";
import { domain } from "../constants/network";
import * as SecureStore from "expo-secure-store";

async function submitForm(data) {
  data.email = data.email.trim();

  const response = await fetch(domain + "/api/user/login", {
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

function LoginForm() {
  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validate={(values) => console.log("Validation function")}
      onSubmit={async (values, { setSubmitting }) => {
        const status = await submitForm(values);
        if (status !== "OK") {
          Alert.alert(
            "Nie można zalogować",
            `Wystąpił błąd podczas próby logowania, odpowiedź serwera: ${status}`,
            [{ text: "OK", onPress: () => console.log("OK Pressed") }],
            { cancelable: true }
          );
        } else {
          console.log("TODO: Redirect to main page");
        }
      }}
    >
      {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
        <Div>
          <InputField name="email" handler={handleChange("email")} />
          <InputField
            name="password"
            handler={handleChange("password")}
            secure
          />
          <LargeButton onPress={handleSubmit}>Zaloguj</LargeButton>
        </Div>
      )}
    </Formik>
  );
}
export default class LoginScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <Text mt={10} fontSize="lg" fontWeight="bold">
          Zaloguj
        </Text>
        <LoginForm />
      </View>
    );
  }
}
