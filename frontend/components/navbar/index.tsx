import { Flex } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import SignUpButton from "../users/sign_up_button";
import items from "./items.json";

type MenuItem = {
  name: string,
  path: string
}

const Navbar: FC = () => {
  return (
    <nav>
      <Flex
        w="0.8"
        gap="xl"
        justify="center"
        align="center"
      >
        <Image src="/images/logo.svg" width={128} height={77} alt={""} />

        {items.map((item: MenuItem) => <Link href={item.path} key={item.name.toLowerCase()}>{item.name}</Link>)}
        <Flex
          justify="flex-end"
        >
          <SignUpButton />
        </Flex>
      </Flex>
    </nav >
  );
}

export default Navbar;