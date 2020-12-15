import { Formik } from "formik";
import React from "react";
import { View } from "react-native";
import { Input, Button, Div, Text } from "react-native-magnus";

function LoginForm() {
  return (
    <Formik
      initialValues={{ email: "", password:"" }}
      validate={(values) => console.log("Validation function")}
      onSubmit={(values, { setSubmitting }) => console.log(values)}
    >
      {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
        <Div>
          <Input
            placeholder="email"
            p={10}
            mt={10}
            focusBorderColor="blue700"
            borderColor="black"
            onChangeText={handleChange('email')}
          />
          <Input
            secureTextEntry
            placeholder="password"
            p={10}
            mt={10}
            focusBorderColor="blue700"
            borderColor="black"
            onChangeText={handleChange('password')}
          />
          <Button
            mt="lg"
            ml="md"
            px="xl"
            py="lg"
            bg="blue500"
            w={300}
            rounded="circle"
            color="white"
            shadow={2}
            onPress={handleSubmit}
          >
            Zaloguj
          </Button>
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
