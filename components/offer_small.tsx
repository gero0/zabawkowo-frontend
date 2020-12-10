import React from "react";
import { domain } from "../constants/network";
import { Div, Text, Image } from "react-native-magnus";
import { TouchableOpacity } from "react-native";

export default class OfferSmall extends React.PureComponent {
  goToDetails(offer, nav) {
    console.log(offer);
    nav.navigate("Details", { offer });
  }

  render() {
    const offer = this.props.offer;
    const nav = this.props.navigation;
    return (
      <TouchableOpacity onPress={this.goToDetails.bind(this, offer, nav)}>
        <Div row w={300} h={100} mb={10} mt={10} p="xl" shadow="sm" rounded="md">
          <Div flex={1}>
            <Image
              w={60}
              h={60}
              source={{
                uri: domain + offer.photo,
              }}
            />
          </Div>
          <Div flex={1}>
            <Text textAlign="left" fontWeight="bold">
              {offer.name}
            </Text>
          </Div>
          <Div flex={1}>
            <Text textAlign="right">{offer.price}zł</Text>
          </Div>
        </Div>
      </TouchableOpacity>
    );
  }
}
