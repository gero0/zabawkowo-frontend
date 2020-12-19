import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { domain } from "../constants/network";
import { View } from "react-native";
import { Div, Text } from "react-native-magnus";
import { ScrollView } from "react-native-gesture-handler";
import { LargeButton } from "../components/formComponents";

function UserSection(props) {
  const user = props.user;
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
            ""
          )}
        </Div>
        <Text fontSize="lg" mt={10}>
          Adresy:
        </Text>

        {user.addresses.map((address) => {
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
        })}

        <LargeButton ml={40} w={240}>Dodaj adres...</LargeButton>
      </Div>
    </ScrollView>
  );
}

export default function UserPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
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
    }

    fetchUser();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      {user ? <UserSection user={user} /> : <Text>Loading...</Text>}
    </View>
  );
}
