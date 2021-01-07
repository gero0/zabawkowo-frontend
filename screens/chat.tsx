import React, { useEffect, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import { Div, Input, Text } from "react-native-magnus";
import { InputField, LargeButton } from "../components/formComponents";
import { domain } from "../constants/network";
import * as SecureStore from "expo-secure-store";

async function fetchAllMessages(chatId: number) {
  const token = await SecureStore.getItemAsync("token");
  if (!token) {
    return;
  }

  const response = await fetch(domain + `/api/chat/${chatId}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      authorization: token,
    },
  });

  const json = await response.json();

  return json;
}

async function update(chatId: number, lastTimestamp: string) {
  const token = await SecureStore.getItemAsync("token");
  if (!token) {
    return;
  }

  const response = await fetch(
    domain + `/api/chat/${chatId}/update?timestamp=${lastTimestamp}`,
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
        authorization: token,
      },
    }
  );

  const json = await response.json();
  return json;
}

function updateMessagesAndTimestamp(setMessages, setTimestamp, json) {
  const newMessages = json.chat.messages;
  if (newMessages && newMessages.length != 0) {
    setMessages((prevMessages) => prevMessages.concat(newMessages));
    const lastTimestamp = newMessages[newMessages.length - 1].send_date;
    setTimestamp(lastTimestamp);
  }
}

async function sendMessage(chatId, text) {
  if (!text || text == "") {
    return false;
  }

  const token = await SecureStore.getItemAsync("token");
  if (!token) {
    return false;
  }

  const date = new Date();
  const timestamp = date.toISOString();

  const response = await fetch(domain + `/api/chat/${chatId}/send`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: token,
    },
    body: JSON.stringify({
      content: text,
      timestamp: timestamp,
    }),
  });

  const json = await response.json();
  return json;
}

export default function ChatScreen({ route, navigation }) {
  const { other_user_id } = route.params;

  const [messages, setMessages] = useState([]);
  const [timestamp, setTimestamp] = useState("");
  const [myId, setMyId] = useState(null);
  const [otherUserData, setOtherUserData] = useState({});
  const [messageText, setMessageText] = useState("");

  const updateMessages = async () => {
    const json = await update(other_user_id, timestamp);
    updateMessagesAndTimestamp(setMessages, setTimestamp, json);
  };

  useEffect(() => {
    const prepareChat = async () => {
      const json = await fetchAllMessages(other_user_id);
      setMyId(json.my_data.id);
      setOtherUserData(json.recipient_data);

      //if there is no messages received to current time
      const date = new Date();
      setTimestamp(date.toISOString());

      updateMessagesAndTimestamp(setMessages, setTimestamp, json);
    };

    prepareChat();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(async function () {
      updateMessages();
    }, 1000);

    return function cleanup() {
      clearInterval(intervalId);
    };
  });

  const scrollView = useRef(null);

  return (
    <View style={{ alignItems: "center" }}>
      <Div>
        <Div>
          <Text>Rozmawiasz z: {otherUserData.username}</Text>
        </Div>
        <ScrollView
          ref={scrollView}
          onContentSizeChange={() => {
            if(!scrollView || !scrollView.current) return;
            scrollView.current!.scrollToEnd({ animated: false});
          }}
        >
          {messages.length != 0 ? (
            messages.map((message) => {
              return (
                <View key={message.id}>
                  {message.sender_id === myId ? (
                    <Div
                      rounded="xl"
                      alignSelf="flex-end"
                      mt={10}
                      maxW={200}
                      p={10}
                      bg="pink500"
                    >
                      <Text>{message.text}</Text>
                    </Div>
                  ) : (
                    <Div
                      rounded="xl"
                      alignSelf="flex-start"
                      mt={10}
                      maxW={200}
                      p={10}
                      bg="blue700"
                    >
                      <Text>{message.text}</Text>
                    </Div>
                  )}
                </View>
              );
            })
          ) : (
            <></>
          )}
        </ScrollView>
        <Div mb={10}>
          <Input
            p={10}
            mt={10}
            focusBorderColor="blue700"
            borderColor="black"
            value={messageText}
            onChangeText={(text) => setMessageText(text)}
          />
          <LargeButton
            onPress={() => {
              sendMessage(other_user_id, messageText);
              setMessageText("");
            }}
          >
            Wyślij wiadomość
          </LargeButton>
        </Div>
      </Div>
    </View>
  );
}
