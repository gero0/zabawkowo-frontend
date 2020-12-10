import React from "react";
import { View } from "react-native";
import { Div, Text, Image } from "react-native-magnus";
import { domain } from "../constants/network";

export default function DetailsScreen({ route, navigation }) {
  const { offer } = route.params;
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Div p="xl" shadow="sm" rounded="md">
        <Div flex={1} alignItems="center">
          <Image
            w={150}
            h={150}
            source={{
              uri: domain + offer.photo,
            }}
          />
        </Div>
        <Div mt={60} flex={1}>
          <Text textAlign="left" fontSize="lg" fontWeight="bold">
            {offer.name}
          </Text>
          <Text>{offer.description}</Text>
        </Div>
        <Div flex={1}>
          <Text fontSize="lg" textAlign="right" fontWeight="bold">
            Cena: {offer.price}zł
          </Text>
        </Div>
      </Div>
    </View>
  );
}
