
import { GetStaticProps } from "next/types";
import GameComponent from "../../components/game";
import { NextPageWithLayout } from "../_app";

export const getStaticProps: GetStaticProps = async () => {
    const gameGateway = {
        host: process.env.GAME_GATEWAY_HOST,
        port: process.env.GAME_GATEWAY_PORT
    }

    return {
        props: { gameGateway: `ws://${gameGateway.host}:${gameGateway.port}` }
    }
}

const Game: NextPageWithLayout = ({ gameGateway }: { gameGateway: string }) => {
    return (
        <div>
            <h1>Game</h1>
            <GameComponent gameGateway={gameGateway} />
        </div>
    )
}

export default Game