import { Avatar, Flex, ScrollArea, Text } from "@mantine/core";
import { useEffect, useRef } from "react";

const Messages = ({ messages }) => {
  const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => elementRef.current.scrollIntoView());
    return <div ref={elementRef} />
  }

  return (
    <Flex w="100%" h="80%" p="3" color="black">
      <ScrollArea>
        {messages.map((item, index) => {
          if (item.from === "me") {
            return (
              <Flex key={index} w="100%" direction="column" justify="flex-end">
                <Flex
                  align="flex-end"
                  justify="end"
                  bg="gray"
                  color="blue"
                  my="1"
                  p="3"
                >
                  <Text>{item.text}</Text>
                </Flex>
              </Flex>
            );
          } else {
            return (
              <Flex key={index} w="100%">
                <Avatar
                  alt="Computer"
                  src="https://avataaars.io/?avatarStyle=Transparent&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light"
                  bg="blue.300"
                ></Avatar>
                <Flex
                  bg="gray.100"
                  color="black"
                  my="1"
                  p="3"
                >
                  <Text>{item.text}</Text>
                </Flex>
              </Flex>
            );
          }
        })}
      </ScrollArea>
      <AlwaysScrollToBottom />
    </Flex>
  );
};

export default Messages;