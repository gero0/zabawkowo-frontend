import { Formik } from "formik";
import React from "react";
import { ScrollView, View } from "react-native";
import { Button, Div, Text } from "react-native-magnus";
import { InputField, LargeButton } from "../components/formComponents";

function RegisterForm() {
  return (
    <Formik
      initialValues={{
        username: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
      }}
      validate={(values) => console.log("Validation function")}
      onSubmit={(values, { setSubmitting }) => console.log(values)}
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
          <InputField name="firstName" handler={handleChange("firstName")} />
          <InputField name="lastName" handler={handleChange("lastName")} />
          <InputField
            name="phoneNumber"
            handler={handleChange("phoneNumber")}
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
