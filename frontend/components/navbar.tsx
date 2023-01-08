import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

const Navbar: FC = () => {
    return (
        <nav>
            <div className="logo">
                <h1>Navbar List</h1>
            </div>
            <Image src="/images/logo.svg" width={128} height={77} alt={""} />
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/users">Users</Link>
            <Link href="/game">Game</Link>
        </nav>
    );
}

export default Navbar;