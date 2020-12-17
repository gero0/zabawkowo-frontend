import { Formik } from "formik";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { Div, Text, Image } from "react-native-magnus";
import { InputField, LargeButton } from "../components/formComponents";
import * as ImagePicker from "expo-image-picker";
import { domain } from "../constants/network";

function sendForm(data, image) {
  let result = fetch(domain + "/api/offer/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "authentication" : "2137" //TODO: authentication
    },
    body: JSON.stringify({data}),
  });
}

function ImageLoader(props) {
  return (
    <Div alignItems="center">
      {props.image ? (
        <Image h={200} w={200} m={10} source={{ uri: props.image! }} />
      ) : null}

      <LargeButton
        onPress={async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
          });

          if (!result.cancelled) {
            props.setImage(result.uri);
          }
        }}
      >
        Załaduj obraz...
      </LargeButton>
    </Div>
  );
}

function OfferForm() {
  const [image, setImage] = useState(null);

  return (
    <Formik
      initialValues={{ name: "", description: "", price: "", age: "" }}
      validate={(values) => console.log("Validation function")}
      onSubmit={(values, { setSubmitting }) => console.log(values)}
    >
      {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
        <View>
          <ImageLoader image={image} setImage={setImage} />
          <Div>
            <InputField name="name" handler={handleChange("name")} />
            <InputField
              name="description"
              handler={handleChange("description")}
            />
            <InputField name="Price" handler={handleChange("price")} />
            <InputField name="Age" handler={handleChange("age")} />
            <LargeButton onPress={handleSubmit}>Utwórz ofertę...</LargeButton>
          </Div>
        </View>
      )}
    </Formik>
  );
}

export default class OfferFormView extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <Div p={20}>
          <Text mt={10} fontSize="lg" fontWeight="bold">
            Utwórz ofertę...
          </Text>
          <ScrollView style={{ flex: 1 }}>
            <OfferForm />
          </ScrollView>
        </Div>
      </View>
    );
  }
}
