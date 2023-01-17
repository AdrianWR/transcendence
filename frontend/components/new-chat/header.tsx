import { Avatar, Flex, Text } from "@mantine/core";

const Header = () => {
  return (
    <Flex w="100%">
      <Avatar size="lg" radius="md" alt="Dan Abrahmov" src="https://bit.ly/dan-abramov" color="green.500" />
      <Flex direction="column" mx="5" justify="center">
        <Text size="lg" weight="bold">
          Ferin Patel
        </Text>
        <Text color="green.500">Online</Text>
      </Flex>
    </Flex>
  )
}

export default Header;