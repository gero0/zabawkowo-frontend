import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { Div, Text, Image, Button } from "react-native-magnus";
import { InputField, LargeButton } from "../components/formComponents";
import { categoryRequest } from "../helpers/categoryHelpers";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import { domain } from "../constants/network";
import { CategorySelectOverlay } from "../components/categorySelectOverlay";
import ErrorMap from "../constants/errors";

async function submitForm(data, image, selectedCategories, offerId) {
  const token = await SecureStore.getItemAsync("token");
  if (!token) {
    return { status: "ERR_TOKEN_LOCAL" };
  }

  const categoryIds = selectedCategories.map((category) => category.id);
  const offer = { ...data, categories: categoryIds };

  //TODO: add try catch for network error
  const dataResponse = await fetch(domain + `/api/offer/${offerId}/edit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: token,
    },
    body: JSON.stringify(offer),
  });

  const dataJson = await dataResponse.json();

  if (dataJson.status !== "OK") {
    console.log(dataJson.status);
    return { status: "ERROR", dataStatus: dataJson.status };
  }

  if (!image) {
    return { status: "OK", dataStatus: dataJson.status };
  }

  let formData = new FormData();

  formData.append("file", {
    uri: image.uri,
    type: "image/png",
    name: "file",
  });

  const imageResponse = await fetch(
    domain + `/api/offer/${offerId}/upload-photo`,
    {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        authorization: token,
      },
      body: formData,
    }
  );

  const imageJson = await imageResponse.json();

  if (imageJson.status !== "OK") {
    console.log(imageJson.status);
    return {
      status: "ERROR",
      dataStatus: dataJson.status,
      imageStatus: imageJson.status,
    };
  }

  return {
    status: "OK",
    dataStatus: dataJson.status,
    imageStatus: imageJson.status,
  };
}

function ImageLoader(props) {
  return (
    <Div alignItems="center">
      {props.image ? (
        <Image h={200} w={200} m={10} source={{ uri: props.image.uri! }} />
      ) : (
        <Image
          h={200}
          w={200}
          m={10}
          source={{ uri: domain + props.offer.photo }}
        />
      )}

      <LargeButton
        onPress={async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
          });

          if (!result.cancelled) {
            props.setImage(result);
            console.log(result);
          }
        }}
      >
        Załaduj obraz...
      </LargeButton>
    </Div>
  );
}

function OfferForm(props) {
  const [image, setImage] = useState(null);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const fetchAndSetCategories = async () => {
      const json = await categoryRequest();
      setCategories(json);

      let selected = [];

      json.forEach((category) => {
        for (const offerCat of props.offer.types) {
          if (category.id == offerCat.id) {
            selected.push(category);
          }
        }
      });

      setSelectedCategories(selected);
    };

    fetchAndSetCategories();
  }, []);

  const selectedCategoriesText = (
    <Text w={300}>
      {selectedCategories.map((category) => {
        return category.name + ", ";
      })}
    </Text>
  );

  return (
    <ScrollView style={{ flex: 1 }}>
      <CategorySelectOverlay
        overlayVisible={overlayVisible}
        setOverlayVisible={setOverlayVisible}
        categories={categories}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
      />
      <Formik
        initialValues={{
          name: props.offer.name,
          description: props.offer.description,
          price: props.offer.price,
          age: props.offer.age,
        }}
        validate={(values) => console.log("Validation function")}
        onSubmit={async (values, { setSubmitting }) => {
          const status = await submitForm(
            values,
            image,
            selectedCategories,
            props.offer.id
          );
          if (status.status !== "OK") {
            const dataStatus = ErrorMap[status.dataStatus];
            let imageStatus = ErrorMap[status.imageStatus];

            if (imageStatus == undefined) {
              imageStatus = "";
            }

            Alert.alert(
              "Nie można dodać oferty",
              `Wystąpił błąd podczas próby edycji oferty: ${dataStatus}, ${imageStatus}`,
              [{ text: "OK", onPress: () => console.log("OK Pressed") }],
              { cancelable: true }
            );
          } else {
            props.navigation.popToTop();
            //TODO: fetch created offer and go to its details
            //props.navigation.navigate("Details", {offer});
          }
        }}
      >
        {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
          <View>
            <ImageLoader
              image={image}
              setImage={setImage}
              offer={props.offer}
            />
            <Div>
              <InputField
                name="name"
                handler={handleChange("name")}
                value={props.offer.name}
              />
              <InputField
                name="description"
                handler={handleChange("description")}
                value={props.offer.description}
              />
              <InputField
                name="Price"
                handler={handleChange("price")}
                value={props.offer.price}
              />
              <InputField
                name="Age"
                handler={handleChange("age")}
                value={props.offer.age}
              />
              <Text>Wybrane kategorie:</Text>
              {selectedCategoriesText}
              <LargeButton onPress={() => setOverlayVisible(true)}>
                Wybierz kategorie...
              </LargeButton>
              <LargeButton onPress={handleSubmit}>Utwórz ofertę...</LargeButton>
            </Div>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
}

export default class OfferFormView extends React.Component {
  render() {
    const { offer } = this.props.route.params;
    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <Div p={20}>
          <Text mt={10} fontSize="lg" fontWeight="bold">
            Edytuj ofertę...
          </Text>
          <OfferForm navigation={this.props.navigation} offer={offer} />
        </Div>
      </View>
    );
  }
}
