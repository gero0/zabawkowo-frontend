import React from "react";
import { ScrollView, View } from "react-native";
import { Input, Button, Div, Text, Image } from "react-native-magnus";

export default class OfferForm extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <Div p={20}>
          <Text mt={10} fontSize="lg" fontWeight="bold">
            Utwórz ofertę...
          </Text>
          <ScrollView style={{ flex: 1 }}>
            <Div alignItems="center">
              <Image
                h={200}
                w={200}
                m={10}
                //source={require('../assets/images/noPhoto.png')}
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
                Załaduj obraz...
              </Button>
            </Div>
            <Div>
              <Input
                placeholder="name"
                p={10}
                mt={10}
                focusBorderColor="blue700"
                borderColor="black"
              />
              <Input
                placeholder="description"
                p={10}
                mt={10}
                multiline={true}
                numberOfLines={4}
                focusBorderColor="blue700"
                borderColor="black"
              />
              <Input
                placeholder="Price"
                p={10}
                mt={10}
                focusBorderColor="blue700"
                borderColor="black"
              />
              <Input
                placeholder="Age"
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
                Utwórz ofertę...
              </Button>
            </Div>
          </ScrollView>
        </Div>
      </View>
    );
  }
}
