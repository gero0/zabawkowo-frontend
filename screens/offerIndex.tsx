import React, { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator, FlatList } from "react-native";
import {domain} from '../constants/network';
import OfferSmall from '../components/offer_small'

export default function HomeScreen({navigation}) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(domain+'/api/offer')
    .then((response) => response.json())
    .then((json) => setData(json))
    .catch((error) => console.error(error))
    .finally(() => setLoading(false));
  }, [])

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {isLoading ? <ActivityIndicator/> : (
        <FlatList
          data={data}
          keyExtractor={({ id }, index) => id}
          renderItem={({ item }) => (
            <OfferSmall offer={item} navigation={navigation}/>
          )}
        />
      )}
    </View>
  );
}

