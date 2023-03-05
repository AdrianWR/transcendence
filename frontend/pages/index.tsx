import { Card, Flex, Title, Text, Image } from "@mantine/core";
import Link from "next/link";
import { ReactElement } from "react";
import Layout from "../components/layout";
import styles from "../styles/Home.module.css";
import { NextPageWithLayout } from "./_app";

const Home: NextPageWithLayout = () => {

  return (
    <Flex
      direction="column"
      justify="center"
      align="center"
      mx="auto"
      w="90vw"
      px="xl"
      mih="75vh"
    >
      <Flex direction={{ base: 'column', sm: 'row' }} justify="space-between" align="center" >
        <Card shadow="xl" w="45%" h="65vh" className={styles['game-card']}>
          <Link href="/game">
          <Title color="white" mb="xl">Game</Title>
          <Image src="/images/home-game-vector.svg" alt="game controller vector" maw={210} mx="auto" my={48} />
          <Text color="white">Dolore sint sint duis minim. Eu nostrud incididunt culpa aute dolore ea tempor est ad adipisicing occaecat dolor amet aliqua. Irure aliquip elit amet aliquip commodo sint dolor. Deserunt laborum cupidatat irure ea exercitation reprehenderit labore.</Text>
          </Link>
        </Card>

        <Card shadow="xl" w="45%" h="65vh" className={styles['chat-card']}>
          <Link href="/chat">
          <Title color="lightBlack" mb="xl">Chat</Title>
          <Image src="/images/home-chat-vector.svg" alt="chat ballon vector" maw={150} mx="auto" my={36} />
          <Text color="lightBlack">Qui irure exercitation nulla in ex eu amet amet elit deserunt sint. Commodo id ad dolor velit dolor irure ex officia aute non non incididunt aute laboris. Irure quis culpa duis ullamco. Sunt ullamco sint exercitation excepteur laboris nisi dolor qui adipisicing aute ad. Laboris esse tempor ea pariatur eu culpa eu sunt dolore.</Text>
          </Link>
        </Card>
      </Flex>
    </Flex>
  );
}

Home.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout imageSrc="/images/cosmic-cliffs.png">
      {page}
    </Layout>
  )
}

export default Home;
