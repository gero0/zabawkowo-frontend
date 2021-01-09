import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import DetailsScreen from "./screens/offerDetails";
import OfferIndex from "./screens/offerIndex";
import RegisterScreen from "./screens/register";
import LoginScreen from "./screens/login";
import OfferForm from "./screens/offerForm";
import OfferEdit from "./screens/offerEdit";
import AddressForm from "./screens/addressForm";
import UserPage from "./screens/userPage";
import ChatScreen from "./screens/chat";
import ChatIndex from "./screens/chatIndex";
import ForgotPassword from "./screens/forgotPassword";
import { Button, ThemeProvider } from "react-native-magnus";
import { View } from "react-native";
import { Div, Text } from "react-native-magnus";
import * as SecureStore from "expo-secure-store";
import { LargeButton } from "./components/formComponents";
import AuthContext from "./constants/AuthContext";

const Stack = createStackNavigator();

function Welcome({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Div>
        <Text textAlign="center" mt={10} fontSize="lg" fontWeight="bold">
          Witaj w Zabawkowie!
        </Text>
        <LargeButton onPress={() => navigation.navigate("Login")}>
          Zaloguj...
        </LargeButton>
        <LargeButton onPress={() => navigation.navigate("Register")}>
          Zarejestruj...
        </LargeButton>
      </Div>
    </View>
  );
}

export default function App() {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "RESTORE_TOKEN":
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case "SIGN_IN":
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case "SIGN_OUT":
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await SecureStore.getItemAsync("token");
      } catch (e) {
        // Restoring token failed
      }
      dispatch({ type: "RESTORE_TOKEN", token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async () => {
        const userToken = await SecureStore.getItemAsync("token");
        dispatch({ type: "SIGN_IN", token: userToken });
      },
      signOut: async () => {
        console.log("signing out...");
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("my_username");
        dispatch({ type: "SIGN_OUT" });
      },
      signUp: async () => {
        const userToken = await SecureStore.getItemAsync("token");
        dispatch({ type: "SIGN_IN", token: userToken });
      },
    }),
    []
  );

  return (
    <ThemeProvider>
      <AuthContext.Provider value={authContext}>
        <NavigationContainer>
          <Stack.Navigator>
            {state.userToken == null ? (
              <>
                <Stack.Screen
                  name="Welcome"
                  component={Welcome}
                  options={{ title: "Ekran powitalny" }}
                />
                <Stack.Screen
                  name="Login"
                  component={LoginScreen}
                  options={{ title: "Logowanie" }}
                />
                <Stack.Screen
                  name="Register"
                  component={RegisterScreen}
                  options={{ title: "Rejestracja" }}
                />
                <Stack.Screen
                  name="ForgotPassword"
                  component={ForgotPassword}
                  options={{ title: "Zapomniałem hasła..." }}
                />
              </>
            ) : (
              <>
                <Stack.Screen
                  name="OfferIndex"
                  component={OfferIndex}
                  options={{ title: "Oferty" }}
                />
                <Stack.Screen
                  name="Details"
                  component={DetailsScreen}
                  options={{ title: "Szczegóły oferty" }}
                />
                <Stack.Screen
                  name="OfferForm"
                  component={OfferForm}
                  options={{ title: "Utwórz ofertę" }}
                />
                <Stack.Screen
                  name="OfferEdit"
                  component={OfferEdit}
                  options={{ title: "Edycja oferty" }}
                />
                <Stack.Screen
                  name="UserPage"
                  component={UserPage}
                  options={({ navigation }) => ({
                    headerRight: () => (
                      <Button mr={20} onPress={() => authContext.signOut()}>
                        Wyloguj
                      </Button>
                    ),
                    title: "Moje konto",
                  })}
                />
                <Stack.Screen
                  name="AddressForm"
                  component={AddressForm}
                  options={{ title: "Dodaj adres" }}
                />
                <Stack.Screen
                  name="ChatIndex"
                  component={ChatIndex}
                  options={{ title: "Wiadomości" }}
                />
                <Stack.Screen
                  name="Chat"
                  component={ChatScreen}
                  options={{ title: "Czat" }}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}
