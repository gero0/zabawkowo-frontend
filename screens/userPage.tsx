import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { domain } from "../constants/network";
import { View } from "react-native";
import { Div, Text } from "react-native-magnus";
import { ScrollView } from "react-native-gesture-handler";
import { LargeButton } from "../components/formComponents";
import OfferSmall from "../components/offer_small";
import AuthContext from "../constants/AuthContext";

function UserSection(props) {
  const user = props.user;
  const offers = props.offers;
  const { signOut } = React.useContext(AuthContext);

  return (
    <ScrollView>
      <Div w={320} mb={30} alignItems="center">
        <Text fontSize="lg" mt={10}>
          Dane
        </Text>
        <Div
          w={250}
          mt={10}
          p="xl"
          rounded="md"
          borderColor="gray500"
          borderWidth={1}
        >
          <Text>Nazwa użytkownika: {user.username}</Text>
          <Text>email: {user.email}</Text>
          <Text>Imię: {user.first_name}</Text>
          <Text>Nazwisko: {user.last_name}</Text>
          {user.phone_number ? (
            <Text>Nr telefonu: {user.phone_number}</Text>
          ) : (
            <Text></Text>
          )}
        </Div>
        <Text fontSize="lg" mt={10}>
          Adresy:
        </Text>

        {user.addresses.length !== 0 ? (
          user.addresses.map((address) => {
            return (
              <Div
                key={address.id}
                w={250}
                mt={10}
                p="xl"
                rounded="md"
                borderColor="gray500"
                borderWidth={1}
              >
                <Text>Ulica: {address.street_address}</Text>
                <Text>Miasto: {address.city}</Text>
                <Text>Kod pocztowy: {address.postal_code}</Text>
              </Div>
            );
          })
        ) : (
          <Text fontSize="lg" mt={10}>
            Brak adresów
          </Text>
        )}

        <LargeButton ml={40} w={240} onPress={() => props.navigation.navigate("AddressForm")}>
          Dodaj adres...
        </LargeButton>

        <Text fontSize="lg" mt={10}>
          Oferty:
        </Text>

        {offers.length !== 0 ? (
          offers.map((offer) => {
            return (
              <View key={offer.id}>
                <OfferSmall offer={offer} navigation={props.navigation} />
              </View>
            );
          })
        ) : (
          <Text fontSize="lg" mt={10}>
            Brak ofert
          </Text>
        )}

      </Div>
    </ScrollView>
  );
}

export default function UserPage({ navigation }) {
  const [user, setUser] = useState(null);
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    async function fetchUserandOffers() {
      const token = await SecureStore.getItemAsync("token");

      if (!token) {
        return;
      }

      const response = await fetch(domain + "/api/user/me", {
        method: "GET",
        headers: {
          authorization: token,
        },
      });

      if (!response) {
        return;
      }

      const json = await response.json();

      setUser(json);

      const offerResponse = await fetch(domain + "/api/offer/myoffers", {
        method: "GET",
        headers: {
          authorization: token,
        },
      });

      if (!offerResponse) {
        return;
      }

      const offersJson = await offerResponse.json();
      setOffers(offersJson);
    }

    fetchUserandOffers();
  }, []);

  return (
    //TODO: refresh on focus
    <View style={{ flex: 1, alignItems: "center" }}>
      {user ? (
        <UserSection user={user} offers={offers} navigation={navigation} />
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
}
