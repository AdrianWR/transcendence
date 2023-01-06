import * as React from "react";
import Link from "next/link";
import Image from "next/image";

const Navbar: React.FC = () => {
    return (
        <nav>
            <div className="logo">
                <h1>Navbar List</h1>
            </div>
            <Image src="/logo.png" width={128} height={77} alt={""} />
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/users">Users</Link>
        </nav>
    );
}

export default Navbar;