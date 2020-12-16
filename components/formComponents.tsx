import React from "react";
import { Input, Button } from "react-native-magnus";

export function InputField(props) {
  return (
    <Input
      secureTextEntry={props.secure}
      placeholder={props.name}
      p={10}
      mt={10}
      focusBorderColor="blue700"
      borderColor="black"
      onChangeText={props.handler}
    />
  );
}

export function LargeButton(props) {
  return (
    <Button
      mt="lg"
      ml="md"
      px="xl"
      py="lg"
      bg="blue500"
      w={props.width ? props.width : 300}
      rounded="circle"
      color="white"
      shadow={2}
      onPress={props.onPress}
    >
      {props.children}
    </Button>
  );
}
