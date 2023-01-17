import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import items from "./items.json";

type MenuItem = {
    name: string,
    path: string
}

const Navbar: FC = () => {
    return (
        <nav>
            <Image src="/images/logo.svg" width={128} height={77} alt={""} />
            {items.map((item: MenuItem) => <Link href={item.path} key={item.name.toLowerCase()}>{item.name}</Link>)}
        </nav >
    );
}

export default Navbar;