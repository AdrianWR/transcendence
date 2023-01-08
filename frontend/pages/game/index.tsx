import GameComponent from "../../components/game";
import { NextPageWithLayout } from "../_app";

const Game: NextPageWithLayout = () => {
    return (
        <div>
            <h1>Game</h1>
            <GameComponent />
        </div>
    )
}

export default Game