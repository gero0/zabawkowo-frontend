import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Div, Text, Image } from "react-native-magnus";
import { LargeButton } from "../components/formComponents";
import { domain } from "../constants/network";

export default function DetailsScreen({ route, navigation }) {
  const { offer: offerParam } = route.params;

  const [offer, setOffer] = useState({ user_id: {}, types: [] });

  useEffect(() => {
    const loadOffer = async () => {
      const response = await fetch(domain + `/api/offer/${offerParam.id}`);
      const json = await response.json();
      setOffer(json);
    };
    loadOffer();
  }, []);

  const categoriesNames = offer.types.map((category) => category.name + ", ");

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
        <Div mt={80} flex={1} w={300}>
          <Text textAlign="left" fontSize="lg" fontWeight="bold">
            {offer.name}
          </Text>
          <Text>{offer.description}</Text>
          <Text mt={20} fontSize="lg">Kategorie: {categoriesNames}</Text>
        </Div>
        <Div flex={1} mt={40}>
          <Text fontSize="lg" textAlign="right" fontWeight="bold">
            Cena: {offer.price}zł
          </Text>
        </Div>
        <Text fontSize="lg">Informacje o sprzedającym:</Text>
        <Div>
          <Text>Użytkownik: {offer.user_id.username}</Text>
          <Text>email: {offer.user_id.email}</Text>
          <Text>
            {offer.user_id.phone_number
              ? "telefon:" + offer.user_id.phone_number
              : ""}
          </Text>
        </Div>
        <LargeButton onPress={console.log("chat")}>
          Wyślij wiadomość...
        </LargeButton>
      </Div>
    </View>
  );
}
