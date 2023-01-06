import { GetStaticProps } from "next";
import { User } from "../../types/users";
import { NextPageWithLayout } from "../_app";

interface Props {
    user: User
}

export async function getStaticPaths() {
    const res: Response = await fetch("https://jsonplaceholder.typicode.com/users");
    const data: Array<User> = await res.json();

    const paths = data.map(user => {
        return {
            params: { id: user.id.toString() }
        };
    });

    return {
        paths,
        fallback: false
    };
}

export const getStaticProps: GetStaticProps = async (context) => {
    const res: Response = await fetch(`https://jsonplaceholder.typicode.com/users/${context.params.id}`)
    const data = await res.json()

    return {
        props: { user: data }
    }
}

const Details: NextPageWithLayout = ({ user }: { user: Props["user"] }) => {
    return (
        <div className="details">
            <h1>{user.name}</h1>
            <p>{user.email}</p>
            <p>{user.website}</p>
            <p>{user.address.city}</p>
        </div>
    )
}

export default Details