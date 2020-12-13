import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, ScrollView } from "react-native";
import { domain } from "../constants/network";
import OfferSmall from "../components/offer_small";
import { Div, Input, Button, Text } from "react-native-magnus";

export default function HomeScreen({ navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(domain + "/api/offer")
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={{ flex:1 , alignItems: "center" }}>
      <Div mt={10}>
        <Input
          w={300}
          placeholder="Szukaj..."
          p={10}
          borderColor="black"
          focusBorderColor="blue700"
        />
        <Text mt={5}>Cena...</Text>
        <Div row mt={5}>
          <Input
            mr={6}
            flex={1}
            w={147}
            placeholder="min"
            p={10}
            borderColor="black"
            focusBorderColor="blue700"
          />
          <Input
            flex={1}
            w={147}
            placeholder="max"
            p={10}
            borderColor="black"
            focusBorderColor="blue700"
          />
        </Div>
        <Div mt={10}>
          <Button
            self-align="center"
            ml="auto"
            w={300}
            bg="blue700"
            color="white"
          >
            Szukaj
          </Button>
        </Div>
      </Div>

      <Div flex={1} mt={20}>
        {isLoading || !Object.keys(data).length ? (
          <ActivityIndicator />
        ) : (
          <ScrollView>
            {data.map((item) => {
              return (
                <View key={item.id}>
                  <OfferSmall offer={item} navigation={navigation} />
                </View>
              );
            })}
          </ScrollView>
        )}
      </Div>
    </View>
  );
}
