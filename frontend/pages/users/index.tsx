import { GetStaticProps } from "next"
import Link from "next/link"
import styles from "../../styles/Games.module.css"
import { User } from "../../types/users"
import { NextPageWithLayout } from "../_app"

export const getStaticProps: GetStaticProps = async (context) => {
    const res: Response = await fetch("https://jsonplaceholder.typicode.com/users")
    const data: Array<User> = await res.json()

    return {
        props: { users: data }
    }

}

const Users: NextPageWithLayout = ({ users }: { users: Array<User> }) => {
    return (
        <div>
            <h1>All Users</h1>
            {users.map(user => (
                <Link href={`users/${user.id}`} key={user.id} className={styles.single}>
                    <h3>{user.name}</h3>
                </Link>

            ))}
        </div>
    );
}

export default Users