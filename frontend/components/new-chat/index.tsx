import { Divider, Flex } from "@mantine/core";
import { FC, useState } from "react";
import Footer from "./footer";
import Header from "./header";
import Messages from "./messages";

const ChatComponent: FC = () => {
  const [messages, setMessages] = useState([
    { from: "computer", text: "Hi, My Name is HoneyChat" },
    { from: "me", text: "Hey there" },
    { from: "me", text: "Myself Ferin Patel" },
    {
      from: "computer",
      text: "Nice to meet you. You can send me message and i'll reply you with same message.",
    },
  ])
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (!inputMessage.trim().length) {
      return;
    }
    const data = inputMessage;

    setMessages((old) => [...old, { from: "me", text: data }]);
    setInputMessage("");

    setTimeout(() => {
      setMessages((old) => [...old, { from: "computer", text: data }]);
    }, 1000);
  }

  return (
    <Flex w="100%" h="100vh" justify="center" align="center">
      <Flex w="40%" h="90%" direction="column">
        <Header />
        <Divider />
        <Messages messages={messages} />
        <Divider />
        <Footer
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSendMessage={handleSendMessage}
        />
      </Flex>
    </Flex>
  )
}

export default ChatComponent;