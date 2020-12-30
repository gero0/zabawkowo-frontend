import React from "react";
import { Formik } from "formik";
import { InputField, LargeButton } from "../components/formComponents";
import { domain } from "../constants/network";
import { Div, Text } from "react-native-magnus";
import { Alert, View } from "react-native";
import ErrorMap from "../constants/errors";

async function submitForm(data) {
  data.email = data.email.trim();

  const response = await fetch(domain + "/api/user/forgot-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json = await response.json();

  return json.status;
}

function ForgotForm(props) {
  return (
    <Formik
      initialValues={{ email: "" }}
      onSubmit={async (values, { setSubmitting }) => {
        const status = await submitForm(values);
        if (status !== "OK") {
          const statusMessage = ErrorMap[status];
          Alert.alert(
            "Nie można zresetować hasła",
            `${statusMessage}`,
            [{ text: "OK", onPress: () => console.log("OK Pressed") }],
            { cancelable: true }
          );
        } else {
          Alert.alert(
            "Link wysłany",
            "Na podany email wysłana została wiadomość z linkiem do zresetowania hasła",
            [{ text: "OK", onPress: () => console.log("OK Pressed") }],
            { cancelable: true }
          );
          console.log("TODO: Redirect to main page");
        }
      }}
    >
      {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
        <Div>
          <InputField name="email" handler={handleChange("email")} />
          <LargeButton onPress={handleSubmit}>Wyślij link</LargeButton>
        </Div>
      )}
    </Formik>
  );
}

export default class ForgotPasswordScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <Text mt={10} fontSize="lg" fontWeight="bold">
          Wyślij link...
        </Text>
        <ForgotForm />
      </View>
    );
  }
}
