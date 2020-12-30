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
      defaultValue={props.value ? props.value : undefined}
    />
  );
}

export function LargeButton(props) {
  return (
    <Button
      mt="lg"
      px="xl"
      py="lg"
      bg="blue500"
      w={props.w ? props.w : 300}
      rounded="circle"
      color="white"
      shadow={2}
      onPress={props.onPress}
      ml={props.ml ? props.ml : "md"}
    >
      {props.children}
    </Button>
  );
}
