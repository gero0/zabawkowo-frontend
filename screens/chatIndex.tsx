import React, { useEffect, useState } from "react";
import { domain } from "../constants/network";
import * as SecureStore from "expo-secure-store";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Div, Text } from "react-native-magnus";
import { useIsFocused } from "@react-navigation/native";

export default function ChatIndex({ route, navigation }) {
  const [chats, setChats] = useState([]);
  const [myId, setMyId] = useState(0);

  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchChats = async () => {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        return;
      }

      const response = await fetch(domain + `/api/chat`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          authorization: token,
        },
      });
      const json = await response.json();
      setChats(json.chats);
      setMyId(json.my_id);
    };

    if (isFocused) fetchChats();
  }, [isFocused]);

  return (
    <ScrollView>
      {chats.length != 0 ? (
        chats.map((chat) => {
          return (
            <TouchableOpacity
              key={chat.id}
              onPress={() => {
                const id =
                  myId == chat.user_id_1 ? chat.user_id_2 : chat.user_id_1;
                navigation.navigate("Chat", { other_user_id: id });
              }}
            >
              <Div
                w={200}
                p={10}
                mt={5}
                mb={5}
                alignSelf="center"
                shadow="sm"
                rounded="md"
              >
                <Text fontSize="lg" fontWeight="bold">
                  {chat.otherUsername}
                </Text>

                <Text>{chat.lastMessage.text}</Text>

                {(chat.user_id_1 == myId && chat.user_notification_1) ||
                (chat.user_id_2 == myId && chat.user_notification_2) ? (
                  <Div p={5} rounded="md" bg="red500">
                    <Text>Nowe</Text>
                  </Div>
                ) : (
                  <></>
                )}
              </Div>
            </TouchableOpacity>
          );
        })
      ) : (
        <Div>
          <Text textAlign="center">Nie masz żadnych wiadomości</Text>
        </Div>
      )}
    </ScrollView>
  );
}
