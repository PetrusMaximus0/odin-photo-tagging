import gameSpace from "../assets/game_space.jpeg"
import Circle from "./Circle";
import React, { useEffect, useRef, useState } from "react";
import waldoProfile from "../assets/waldo_space.png"
import yeldoProfile from "../assets/yeldo_space.png"
import wizzardProfile from "../assets/wizzard_space.png"

export default function Game() {
    //
    const imageRef = useRef<null | HTMLElement>(null);
    
    //
    const solutions = {
        "yeldo": { x: 0.070, y: 0.69 },
        "waldo": { x: 0.405, y: 0.625 },
        "wizzard": { x: 0.780, y: 0.585 },
    }
    //
    const [markerPosition, setMarkerPosition] = useState({ x: -1000, y: -1000 });
    const [showMarker, setShowMarker] = useState(false);
    const [markerRelativePosition, setMarkerRelativePosition] = useState({ x: 0, y: 0 });

    //
    const [foundCharacters, setFoundCharacters] = useState({ waldo: false, yeldo: false, wizzard: false });


    const isCharacter = (character: string) => {
        const maxDistance = 0.01;

        const distanceX = Math.abs(markerRelativePosition.x - solutions[`${character}`].x);
        const distanceY = Math.abs(markerRelativePosition.y - solutions[`${character}`].y);
        const distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));

        return distance <= maxDistance;
    }

    const setMarker = (e :React.MouseEvent<HTMLElement>) => {
        const element = e.target as HTMLElement;

        if (element.classList.contains("marker")) {            
            setShowMarker(false);
            
        } else {
            const rect = e.currentTarget.getBoundingClientRect();
            setShowMarker(true);
            setMarkerRelativePosition({ x: (e.clientX - rect.left) / e.currentTarget.offsetWidth, y: (e.clientY - rect.top) / e.currentTarget.offsetHeight });
            setMarkerPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }
    }
    
    const handleSelectClick = (e: React.MouseEvent<HTMLElement>, elementName: string) => {
        e.stopPropagation();
        if (elementName === "image") {
            setMarker(e);
        } else {
            const result = isCharacter(elementName);
            setFoundCharacters({ ...foundCharacters, [`${elementName}`]: result })
            setShowMarker(false);
        }

    }


    useEffect(() => {
        const onResize = () => {
            setShowMarker(false);            
        }

        window.addEventListener("resize", onResize);
        return () => {
            window.removeEventListener("resize", onResize);
        }
    }, []);

    const boxSize = 16;

    return (
        <div className="flex flex-col gap-6">
            <p className="text-2xl"> Find these characters </p>
            <ul className="flex gap-4 justify-center text-xl">
                <li>
                    <figure className="w-20 h-auto">
                        <img src={waldoProfile} alt="Waldo"/>
                    </figure>
                </li>
                <li>
                    <figure className="w-20 h-auto">
                        <img src={wizzardProfile} alt="The Wizzard"/>
                    </figure>
                </li>
                <li>
                    <figure className="w-20 h-auto">
                        <img src={yeldoProfile} alt="Yeldo"/>
                    </figure>
                </li>
            </ul>
            <figure ref={imageRef} onClick={e => handleSelectClick(e, "image")} className="w-full h-auto border game-image relative">
                {showMarker && <Circle position={markerPosition} foundCharacters={foundCharacters} handleClick={handleSelectClick} />}
                {imageRef.current!==null &&
                    <>
                        {foundCharacters.waldo &&
                            <div style={{ top: (solutions.waldo.y * imageRef.current!.offsetHeight - boxSize / 2), left: (solutions.waldo.x * imageRef.current!.offsetWidth - boxSize / 2) }} className={"w-6 h-6 border-2 border-purple-700 bg-opacity-40 bg-purple-900 absolute rounded-xl"}>
                            </div>
                        }
                        {foundCharacters.wizzard &&
                            <div style={{ top: (solutions.wizzard.y * imageRef.current!.offsetHeight - boxSize / 2), left: (solutions.wizzard.x * imageRef.current!.offsetWidth - boxSize / 2) }} className={"w-6 h-6 border-2 border-purple-700 bg-opacity-40 bg-purple-900 absolute rounded-xl"}>
                            </div>}
                        {foundCharacters.yeldo &&
                            <div style={{ top: (solutions.yeldo.y* imageRef.current!.offsetHeight - boxSize/2), left: (solutions.yeldo.x*imageRef.current!.offsetWidth - boxSize/2)}} className={"w-6 h-6 border-2 border-purple-700 bg-opacity-40 bg-purple-900 absolute rounded-xl"}>
                            </div>
                        }
                    </>
                }
                <img className="w-full" src={gameSpace} alt="The game Image" />
            </figure>
        </div>
    )
}