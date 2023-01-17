import { ActionIcon, Group, Stack, TextInput } from "@mantine/core";
import { getHotkeyHandler } from "@mantine/hooks";
import { useState } from "react";

type Message = {
  text: string,
  createdAt: string,
  repliedTo?: string,
  ruid?: string,
  rtext?: string,
  uid: string,
  photoURL: string
}

type User = {
  uid: string,
  photoURL: string
}

const ChatBox = (props: any) => {
  const [value, setValue] = useState("");
  const messagesRef: Array<Message> = [];
  const user: User = { uid: "adrian", photoURL: "my-http.com" };
  let mess = "";
  const sendMessage = async () => {
    if (user) {
      if (value.length > 100) {
        console.error("Must not exceed 100 characters");
        setValue("");
      } else {
        props.fn();
        mess = value;
        setValue("");
        const { uid, photoURL } = user;
        if (props.id === "") {
          await messagesRef.push({
            text: mess,
            createdAt: "now",
            uid,
            photoURL,
          });
        } else {
          await messagesRef.push({
            text: mess,
            createdAt: "now",
            repliedTo: props.id,
            ruid: props.ruid.senderUid,
            rtext: props.ruid.msgText,
            uid,
            photoURL,
          });
        }
      }
    }
  };

  return (
    <>
      <Stack sx={{ height: "8vh" }} justify="center" p={0}>
        <Group position="right" p="xs">
          <TextInput
            value={value}
            onChange={(event) => setValue(event.currentTarget.value)}
            sx={{ flexGrow: 1 }}
            placeholder="Say something nice . . . "
            rightSection={
              <ActionIcon
                onClick={() =>
                  console.log("Display only hehe", {
                    icon: "😁",
                  })
                }
              >
              </ActionIcon>
            }
            onKeyDown={
              !/\S/.test(value)
                ? undefined
                : value.length < 2
                  ? undefined
                  : getHotkeyHandler([["Enter", sendMessage]])
            }
          />
          <ActionIcon
            onClick={() => sendMessage()}
            variant="gradient"
            size="lg"
            disabled={
              !/\S/.test(value) ? true : value.length < 2 ? true : false
            }
          >
          </ActionIcon>
        </Group>
      </Stack>
    </>
  );
};

export default ChatBox;