import { GetStaticProps } from "next"
import Link from "next/link"
import { Key } from "react"
import styles from "../../styles/Games.module.css"
import { NextPageWithLayout } from "../_app"

interface Game {
    id: Key,
    name: String
}

export const getStaticProps: GetStaticProps = async (context) => {
    const res: Response = await fetch("https://jsonplaceholder.typicode.com/users")
    const data: Array<Game> = await res.json()

    return {
        props: { games: data }
    }

}

const Users: NextPageWithLayout = ({ games }: { games: Array<Game> }) => {
    return (
        <div>
            <h1>All Games</h1>
            {games.map(game => (
                <Link href={`game/${game.id}`} key={game.id} className={styles.single}>
                    <h3>{game.name}</h3>
                </Link>

            ))}
        </div>
    );
}

export default Users