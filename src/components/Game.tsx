import gameSpace from "../assets/game_space.jpeg"
import Circle from "./Circle";
import { useState } from "react";

export default function Game() {
    const [markerPosition, setMarkerPosition] = useState({ x: 0, y: 0 });
    
    const handleClickOnImage = (e) => {
        const rect = e.target.getBoundingClientRect();
        setMarkerPosition({x: e.clientX - rect.left, y: e.clientY - rect.top})
        console.log("x:", e.clientX - rect.left, " y:", e.clientY - rect.top);
    }

    return (
        <div className="flex flex-col gap-6">
            <ul className="flex gap-4 justify-center text-xl">
                <li>
                    Wally
                </li>
                <li>
                    Wizzard
                </li>
                <li>
                    The other Guy
                </li>
            </ul>
            <figure onClick={e => handleClickOnImage(e)} className="w-full h-auto border game-image relative">
                <Circle position={markerPosition} />
                <img className="w-full" src={gameSpace} alt="The game Image" />
            </figure>
        </div>
    )
}