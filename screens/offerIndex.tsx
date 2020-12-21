import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, ScrollView } from "react-native";
import { domain } from "../constants/network";
import OfferSmall from "../components/offer_small";
import {
  Div,
  Input,
  Button,
  Text,
  Overlay,
  Checkbox,
} from "react-native-magnus";
import { Formik } from "formik";

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

async function categoryRequest() {
  const url = domain + "/api/offer/categories";

  try {
    const response = await fetch(url);
    const json = await response.json();
    return json;
  } catch (e) {
    console.log(`categories fetch exception. ERROR: ${e}`);
    return {};
  }
}

const handleCategoryChange = (categories, category) => {
  let newArray = [...categories];

  if (newArray.includes(category)) {
    newArray.splice(newArray.indexOf(category), 1);
  } else {
    newArray.push(category);
  }

  return newArray;
};

function CategorySelectOverlay(props) {
  const checkBoxes = props.categories.map((category) => {
    return (
      <Checkbox
        key={category.id}
        checked={props.selectedCategories.includes(category)}
        prefix={
          <Text ml={20} flex={1}>
            {category.name}
          </Text>
        }
        onChange={() => {
          const selected = handleCategoryChange(
            props.selectedCategories,
            category
          );

          props.setSelectedCategories(selected);
        }}
      />
    );
  });

  return (
    <Overlay visible={props.overlayVisible} p="xl">
      <Text fontSize="lg" mt="md">
        Kategorie
      </Text>
      <Div mt={20}>{checkBoxes}</Div>
      <Button
        mt={20}
        onPress={() => {
          props.setOverlayVisible(false);
        }}
      >
        OK
      </Button>
    </Overlay>
  );
}

export default function HomeScreen({ navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    searchRequest({})
      .then((json) => setData(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));

    categoryRequest()
      .then((json) => setCategories(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

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
          initialValues={{ email: "", password: "" }}
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
    </View>
  );
}
