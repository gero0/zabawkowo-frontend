import React from "react";
import { View } from "react-native";
import { Input, Button, Div, Text } from "react-native-magnus";

export default class RegisterScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <Text mt={10} fontSize="lg" fontWeight="bold">
          Zarejestruj
        </Text>
        <Div>
          <Input
            placeholder="username"
            p={10}
            mt={10}
            focusBorderColor="blue700"
            borderColor="black"
          />
          <Input
            secureTextEntry
            placeholder="password"
            p={10}
            mt={10}
            focusBorderColor="blue700"
            borderColor="black"
          />
          <Input
            placeholder="email"
            p={10}
            mt={10}
            focusBorderColor="blue700"
            borderColor="black"
          />
          <Input
            placeholder="firstName"
            p={10}
            mt={10}
            focusBorderColor="blue700"
            borderColor="black"
          />
          <Input
            placeholder="lastName"
            p={10}
            mt={10}
            focusBorderColor="blue700"
            borderColor="black"
          />
          <Input
            placeholder="phoneNumber"
            p={10}
            mt={10}
            focusBorderColor="blue700"
            borderColor="black"
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
            onPress={() => console.log("AAAAAA")}
          >
            Zarejestruj
          </Button>
        </Div>
      </View>
    );
  }
}
