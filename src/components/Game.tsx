//
import Timer from "./Timer";
import Circle from "./Circle";
//
import React, { useEffect, useRef, useState } from "react";
//
import gameSpace from "../assets/game_space.jpeg"
import waldoProfile from "../assets/waldo_space.png"
import yeldoProfile from "../assets/yeldo_space.png"
import wizzardProfile from "../assets/wizzard_space.png"

const apiURL = import.meta.env.VITE_API_URL;

export default function Game() {
    //
    const imageRef = useRef<null | HTMLElement>(null);
    
    //
    interface ISolutions{
        yeldo?: {x: number, y: number}, 
        waldo?: {x: number, y: number}, 
        wizzard?: {x: number, y: number},
    }

    //
    interface ISession{
        _id: "string"
    }

    //
    interface IScore{
        _id: "string"
    }
    //
    const [score, setScore] = useState<IScore|null>(null)
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [session, setSession] = useState<ISession | null>(null);
    const [solutions, setSolutions] = useState<null|ISolutions>(null)
    const [markerPosition, setMarkerPosition] = useState({ x: -1000, y: -1000 });
    const [showMarker, setShowMarker] = useState(false);
    const [markerRelativePosition, setMarkerRelativePosition] = useState({ x: 0, y: 0 });

    //
    const [foundCharacters, setFoundCharacters] = useState({ waldo: false, yeldo: false, wizzard: false });

    //
    const isCharacter = async (character: string) => {
        try {
            const response = await fetch(`${apiURL}/game/verifyClick`, {
                mode: "cors",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    character : character,
                    coordinates : markerRelativePosition,
                })
            })

            const res = await response.json();
            return res;
            
        } catch (error) {
            console.error(error);
            return false;
        }
        
    }

    //
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
       
    //
    const handleSelectClick = async (e: React.MouseEvent<HTMLElement>, elementName: string) => {
        e.stopPropagation();
        if (elementName === "image") {
            setMarker(e);
        
        } else {
            
            const response = await isCharacter(elementName);
            
            if (response.result === true) {
                const newFoundCharacters = {...foundCharacters, [`${elementName}`]: true }
                setFoundCharacters(newFoundCharacters);
                setSolutions({...solutions, [`${response.character}`]: response.solution})
                if (Object.keys(newFoundCharacters).length === 3) {
                    endGame();
                }
            }
            setShowMarker(false);            
        }

    }

    //
    const endGame = async () => {
        try {
            
            const response = await fetch(apiURL + "/game/end-game", {
                mode: "cors",
            method: "POST",
            headers: {
                "ContentType": "application/json",
            },
            body: JSON.stringify({id: session!._id})
            })
            
            if (response.status >= 400) {
                throw new Error("An error has ocurred while attemping to close end Game");
            }

            const result = await response.json();
            if (result.score !== null) {
                // Handle the score is in the top 10
                setScore(result._id);
            } else {
                // Handle the score is NOT in the top 10
            }
            
        } catch (error) {
            setError(error as Error);
        }


    }

    // Start a game session
    useEffect(() => {
        // When the component is loaded, request a game session start
        const startGame = async () => {
            try{
                const response = await fetch(apiURL + "/session/start-game", {
                    mode: "cors",
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                    }
                })

                if (response.status >= 400) {
                    throw new Error("Game session couldn't start! Please try again.")
                }
                
                const result = await response.json();
                setSession(result.session);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                setError(error as Error);
            }
        }
        startGame();        
    },[])

    // Bind the resizing of the screen
    useEffect(() => {
        // Resizing the window adjusts the box locations
        const onResize = () => {
            setShowMarker(false);            
        }
        window.addEventListener("resize", onResize);
        
        // Clean up function
        return () => {
            window.removeEventListener("resize", onResize);
        }

    }, []);
    
    //
    const boxSize = 16;

    return (
        error && <p> {error.message} </p> ||
        loading && <p>Loading...</p> ||
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
            <div className="text-5xl">
                <Timer active={true} />
            </div>
            <figure ref={imageRef} onClick={e => handleSelectClick(e, "image")} className="w-full h-auto border game-image relative">
                {showMarker && <Circle position={markerPosition} foundCharacters={foundCharacters} handleClick={handleSelectClick} />}
                {imageRef.current!==null && solutions !== null &&
                    <>
                        {foundCharacters.waldo && solutions.waldo &&
                            <div style={{ top: (solutions.waldo.y * imageRef.current!.offsetHeight - boxSize / 2), left: (solutions.waldo.x * imageRef.current!.offsetWidth - boxSize / 2) }} className={"w-6 h-6 border-2 border-purple-700 bg-opacity-40 bg-purple-900 absolute rounded-xl"}>
                            </div>
                        }
                        {foundCharacters.wizzard && solutions.wizzard &&
                            <div style={{ top: (solutions.wizzard.y * imageRef.current!.offsetHeight - boxSize / 2), left: (solutions.wizzard.x * imageRef.current!.offsetWidth - boxSize / 2) }} className={"w-6 h-6 border-2 border-purple-700 bg-opacity-40 bg-purple-900 absolute rounded-xl"}>
                            </div>}
                        {foundCharacters.yeldo && solutions.yeldo &&
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