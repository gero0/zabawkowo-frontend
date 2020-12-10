import * as React from "react";
import { View, Text, Button } from "react-native";
import { NavigationContainer} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import DetailsScreen from "./screens/offerDetails";
import HomeScreen from "./screens/offerIndex";
import { ThemeProvider } from "react-native-magnus";

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Oferty" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function Main() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}

export default Main;
