
import { GetStaticProps, NextPage } from "next";
import GameComponent from "../../components/game";

type GamePageProps = {
    gateway: string
}

export const getStaticProps: GetStaticProps = () => {
    return {
        props: { gateway: process.env.GATEWAY_URL }
    }
}

const Game: NextPage = ({ gateway }: GamePageProps) => {
    return (
        <div>
            <h1>Game</h1>
            <GameComponent gateway={gateway} />
        </div>
    )
}

export default Game