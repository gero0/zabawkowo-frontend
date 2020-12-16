import { Formik } from "formik";
import React from "react";
import { ScrollView, View } from "react-native";
import { Input, Button, Div, Text, Image } from "react-native-magnus";
import { InputField, LargeButton } from "../components/formComponents";

function OfferForm() {
  return (
    <Formik
      initialValues={{ name: "", description: "", price: "", age: "" }}
      validate={(values) => console.log("Validation function")}
      onSubmit={(values, { setSubmitting }) => console.log(values)}
    >
      {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
        <View>
          <Div alignItems="center">
            <Image
              h={200}
              w={200}
              m={10}
              //source={require('../assets/images/noPhoto.png')}
            />
            <LargeButton onPress={() => console.log("loading picture...")}>
              Załaduj obraz...
            </LargeButton>
          </Div>
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
