import { Formik } from "formik";
import React from "react";
import { ScrollView, View } from "react-native";
import { Input, Button, Div, Text } from "react-native-magnus";

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
          <Input
            placeholder="username"
            p={10}
            mt={10}
            focusBorderColor="blue700"
            borderColor="black"
            onChangeText={handleChange('username')}
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
          <Input
            placeholder="email"
            p={10}
            mt={10}
            focusBorderColor="blue700"
            borderColor="black"
            onChangeText={handleChange('email')}
          />
          <Input
            placeholder="firstName"
            p={10}
            mt={10}
            focusBorderColor="blue700"
            borderColor="black"
            onChangeText={handleChange('firstName')}
          />
          <Input
            placeholder="lastName"
            p={10}
            mt={10}
            focusBorderColor="blue700"
            borderColor="black"
            onChangeText={handleChange('lastName')}
          />
          <Input
            placeholder="phoneNumber"
            p={10}
            mt={10}
            focusBorderColor="blue700"
            borderColor="black"
            onChangeText={handleChange('phoneNumber')}
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
            Zarejestruj
          </Button>
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
