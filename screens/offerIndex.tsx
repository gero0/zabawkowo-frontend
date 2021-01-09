import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, ActivityIndicator, ScrollView } from "react-native";
import { domain } from "../constants/network";
import { categoryRequest } from "../helpers/categoryHelpers";
import { CategorySelectOverlay } from "../components/categorySelectOverlay";
import OfferSmall from "../components/offer_small";
import { Div, Input, Button, Text, Fab } from "react-native-magnus";
import { Formik } from "formik";
import * as SecureStore from "expo-secure-store";
import { useIsFocused } from "@react-navigation/native";

async function searchRequest(values, selectedCategories) {
  let url = domain + "/api/offer?";

  if (values.search) {
    url += `search_text=${values.search}&`;
  }

  if (values.min) {
    url += `min_price=${values.min}&`;
  }

  if (values.max) {
    url += `max_price=${values.max}&`;
  }

  if (selectedCategories) {
    let categoryString = "";

    selectedCategories.forEach((category) => {
      categoryString += category.id + ";";
    });

    url += `categories=${categoryString}`;
  }

  console.log(`Request url: ${url}`);
  try {
    const response = await fetch(url);
    const json = await response.json();
    return json;
  } catch (e) {
    console.log(`offers fetch exception. ERROR: ${e}`);
    return {};
  }
}

//TODO: refresh on focus

function fetchDataAndCategories(setData, setCategories, setLoading) {
  searchRequest({})
    .then((json) => setData(json))
    .catch((error) => console.error(error))
    .finally(() => setLoading(false));

  categoryRequest()
    .then((json) => setCategories(json))
    .catch((error) => console.error(error))
    .finally(() => setLoading(false));
}

export default function HomeScreen({ navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [data, setData] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);

  const isFocused = useIsFocused();

  useEffect(() => {
    if(isFocused){
      fetchDataAndCategories(setData, setCategories, setLoading);
    }
  }, [isFocused]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = await SecureStore.getItemAsync("token");

      if (!token) {
        return;
      }

      const response = await fetch(domain + `/api/chat/notifications`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          authorization: token,
        },
      });

      const json = await response.json();

      setNotificationCount(json.count);
    };

    if(isFocused){
      fetchNotifications();
    }

  }, [notificationCount, isFocused]);

  useLayoutEffect(() => {
    const msgButtonContent =
      notificationCount > 0 ? (
        <>
          <Text color="white">Wiadomości: </Text>
          <Div bg="red500" rounded="md" minW={20} alignItems="center">
            <Text color="white">{notificationCount}</Text>
          </Div>
        </>
      ) : (
        <Text color="white">Wiadomości</Text>
      );
    navigation.setOptions({
      headerRight: () => (
        <Div row>
          <Button
            mr={20}
            onPress={() => {
              navigation.navigate("ChatIndex");
            }}
          >
            {msgButtonContent}
          </Button>
          <Button mr={20} p={10} onPress={() => navigation.navigate("UserPage")}>
            Mój profil...
          </Button>
        </Div>
      ),
    });
  }, [navigation, notificationCount]);

  const selectedCategoriesText = (
    <Text w={300}>
      {selectedCategories.map((category) => {
        return category.name + ", ";
      })}
    </Text>
  );

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <CategorySelectOverlay
        overlayVisible={overlayVisible}
        setOverlayVisible={setOverlayVisible}
        categories={categories}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
      />
      <ScrollView>
        <Formik
          initialValues={{ search: "", min: "", max: "" }}
          validate={(values) => {}}
          onSubmit={async (values, { setSubmitting }) => {
            const offers = await searchRequest(values, selectedCategories);
            setData(offers);
          }}
        >
          {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
            <Div mt={10}>
              <Input
                w={300}
                placeholder="Szukaj..."
                p={10}
                borderColor="black"
                focusBorderColor="blue700"
                onChangeText={handleChange("search")}
              />
              <Text mt={5}>Cena...</Text>
              <Div row mt={5}>
                <Input
                  flex={1}
                  w={147}
                  placeholder="min"
                  p={10}
                  borderColor="black"
                  focusBorderColor="blue700"
                  onChangeText={handleChange("min")}
                />
                <Input
                  flex={1}
                  w={147}
                  placeholder="max"
                  p={10}
                  borderColor="black"
                  focusBorderColor="blue700"
                  onChangeText={handleChange("max")}
                />
              </Div>
              <Text>Wybrane kategorie:</Text>
              {selectedCategoriesText}
              <Button
                self-align="center"
                ml="auto"
                w={300}
                bg="blue700"
                color="white"
                onPress={() => setOverlayVisible(true)}
              >
                Wybierz kategorie...
              </Button>
              <Div mt={10}>
                <Button
                  self-align="center"
                  ml="auto"
                  w={300}
                  bg="blue700"
                  color="white"
                  onPress={handleSubmit}
                >
                  Szukaj
                </Button>
              </Div>
            </Div>
          )}
        </Formik>

        <Div flex={1} mt={20}>
          {isLoading || !Object.keys(data).length ? (
            <ActivityIndicator />
          ) : (
            <>
              {data.map((item) => {
                return (
                  <View key={item.id}>
                    <OfferSmall offer={item} navigation={navigation} />
                  </View>
                );
              })}
            </>
          )}
        </Div>
      </ScrollView>
      <Fab
        bg="blue600"
        h={50}
        w={50}
        onPress={() => navigation.navigate("OfferForm")}
      ></Fab>
    </View>
  );
}
