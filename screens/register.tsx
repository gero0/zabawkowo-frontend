import * as SecureStore from "expo-secure-store";
import { domain } from "../constants/network";
import { Formik } from "formik";
import React from "react";
import { Alert, ScrollView, View } from "react-native";
import { Button, Div, Text } from "react-native-magnus";
import { InputField, LargeButton } from "../components/formComponents";
import ErrorMap from "../constants/errors";
import AuthContext from "../constants/AuthContext"

async function submitForm(data) {
  if (data.username) data.username = data.username.trim();
  if (data.email) data.email = data.email.trim();
  if (data.first_name) data.first_name = data.first_name.trim();
  if (data.last_name) data.last_name = data.last_name.trim();
  if (data.phone_number) data.phone_number = data.phone_number.trim();

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

  const userResponse = await fetch(domain + "/api/user/me", {
    method: "GET",
    headers: { authorization: json.token },
  });

  const user = await userResponse.json();

  await SecureStore.setItemAsync("my_username", user.username);

  return json.status;
}

function RegisterForm(props) {

  const { signUp } = React.useContext(AuthContext);

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
          const statusMessage = ErrorMap[status];
          Alert.alert(
            "Nie można zarejestrować",
            `${statusMessage}`,
            [{ text: "OK", onPress: () => console.log("OK Pressed") }],
            { cancelable: true }
          );
        } else {
          signUp();
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
    const { navigation } = this.props;

    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <Text mt={10} fontSize="lg" fontWeight="bold">
          Zarejestruj
        </Text>
        <ScrollView style={{ flex: 1 }}>
          <RegisterForm navigation={navigation} />
        </ScrollView>
      </View>
    );
  }
}
