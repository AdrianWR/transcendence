import { Flex, Space, Text } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";
import SignUpButton from "../Buttons/SignUpButton";
import items from "./items.json";
import styles from "./styles.module.css";

type MenuItem = {
  name: string,
  path: string
}

const Navbar: FC = () => {
  const router = useRouter();

  const isActive = (item: MenuItem): boolean => String(router.pathname) === item.path;

  return (
    <nav>
      <Flex
        justify="space-between"
        align="center"
        py="sm"
        px="xl"
        mb="xl"
        className={styles['nav-header']}
      >
        <Flex align='center'>
          <Image src="/images/logo.svg" width={80} height={48} alt={""} />
          <Text color='white' weight='bold'>42 Transcendence</Text>
        </Flex>

        <Flex
          justify="flex-end"
          align='center'
          >
          {items.map((item: MenuItem) => (<Flex key={item.name.toLowerCase()} className={`${styles["page-nav-link"]} ${isActive(item) ? styles["active"] : ""}`} ><Link href={item.path}><Text weight='bold'>{item.name}</Text></Link><Space w='xl'/></Flex>))}
          <Space w={36}/>
          <SignUpButton />
        </Flex>
      </Flex>
    </nav >
  );
}

export default Navbar;
