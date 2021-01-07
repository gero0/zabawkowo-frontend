import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Div, Text, Image } from "react-native-magnus";
import { LargeButton } from "../components/formComponents";
import { domain } from "../constants/network";

async function removeOffer(offer_id) {
  const token = await SecureStore.getItemAsync("token");
  if (!token) {
    return;
  }

  const response = await fetch(domain + `/api/offer/${offer_id}/delete`, {
    method: "POST",
    headers: { authorization: token },
  });

  const json = await response.json();

  return json.status;
}

export default function DetailsScreen({ route, navigation }) {
  const { offer: offerParam } = route.params;

  const [offer, setOffer] = useState({ user_id: {}, types: [] });
  const [user, setUser] = useState("");

  useEffect(() => {
    const loadOffer = async () => {
      const response = await fetch(domain + `/api/offer/${offerParam.id}`);
      const json = await response.json();
      setOffer(json);

      const username = await SecureStore.getItemAsync("my_username");
      if (username) {
        setUser(username);
      }
    };
    loadOffer();
  }, []);

  const categoriesNames = offer.types.map((category) => category.name + ", ");

  const conditionalButton =
    user && offer.user_id.username === user ? (
      <LargeButton
        onPress={async () => {
          const status = await removeOffer(offer.id);
          navigation.navigate("OfferIndex");
        }}
      >
        Usuń ofertę...
      </LargeButton>
    ) : (
      <LargeButton
        onPress={() => {
          navigation.navigate("Chat", { other_user_id: offer.user_id.id });
        }}
      >
        Wyślij wiadomość...
      </LargeButton>
    );

  const editButton =
    user && offer.user_id.username === user ? (
      <LargeButton
        onPress={async () => {
          navigation.navigate("OfferEdit", { offer });
        }}
      >
        Edytuj ofertę...
      </LargeButton>
    ) : (
      <Text></Text>
    );

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
          <Text mt={20} fontSize="lg">
            Kategorie: {categoriesNames}
          </Text>
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
        {editButton}
        {conditionalButton}
      </Div>
    </View>
  );
}
