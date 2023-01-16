
import { GetStaticProps } from "next/types";
import GameComponent from "../../components/game";
import { NextPageWithLayout } from "../_app";

export const getStaticProps: GetStaticProps = async () => {
    return {
        props: {
            gateway: "/"
        }
    }
}

const Game: NextPageWithLayout = ({ gateway }: { gateway: string }) => {
    return (
        <div>
            <h1>Game</h1>
            <GameComponent gateway={gateway} />
        </div>
    )
}

export default Game