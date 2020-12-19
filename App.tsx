import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import DetailsScreen from "./screens/offerDetails";
import HomeScreen from "./screens/offerIndex";
import RegisterScreen from "./screens/register";
import LoginScreen from "./screens/login";
import OfferForm from "./screens/offerForm";
import AddressForm from "./screens/addressForm";
import UserPage from "./screens/userPage";
import { ThemeProvider } from "react-native-magnus";
import { createDrawerNavigator } from "@react-navigation/drawer";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function Home() {
  return (
    <Drawer.Navigator initialRouteName="Oferty">
      <Stack.Screen name="Oferty" component={HomeScreen} />
      <Stack.Screen name="Dodaj ofertę..." component={OfferForm} />
      <Stack.Screen name="Zaloguj..." component={LoginScreen} />
      <Stack.Screen name="Zarejestruj..." component={RegisterScreen} />
      <Stack.Screen name="Profil..." component={UserPage} />
      <Stack.Screen name="Dodaj adres..." component={AddressForm} />
    </Drawer.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
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
