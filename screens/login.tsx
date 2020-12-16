import { Formik } from "formik";
import React from "react";
import { View } from "react-native";
import { Button, Div, Text } from "react-native-magnus";
import { InputField, LargeButton } from "../components/formComponents";

function LoginForm() {
  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validate={(values) => console.log("Validation function")}
      onSubmit={(values, { setSubmitting }) => console.log(values)}
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
