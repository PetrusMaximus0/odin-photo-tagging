// Components imported
import Timer from "./Timer";
import Circle from "./Circle";
import SaveUsername from "./SaveUsername";

//
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// Image resources
import gameSpace from "../assets/game_space.jpeg"
import waldoProfile from "../assets/waldo_space.png"
import yeldoProfile from "../assets/yeldo_space.png"
import wizzardProfile from "../assets/wizzard_space.png"

// Import the apiURl
const apiURL = import.meta.env.VITE_API_URL;

export default function Game({boxSize = 16}: {boxSize?: number}) {
    //
    const imageRef = useRef<null | HTMLElement>(null);
    
    //
    const navigate = useNavigate();

    //
    interface ISolutions{
        yeldo?: {x: number, y: number}, 
        waldo?: {x: number, y: number}, 
        wizzard?: {x: number, y: number},
    }

    //
    const [gameState, setGameState] = useState<"ongoing" | "end">("ongoing");

    //
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    //
    const [score, setScore] = useState<{time: number, id: string}>({time: 0, id: ""});
    const [session, setSession] = useState<{_id: string}| null>(null);
    const [solutions, setSolutions] = useState<ISolutions | null>(null)
    const [foundCharacters, setFoundCharacters] = useState({ waldo: false, yeldo: false, wizzard: false });
    //
    const [markerPosition, setMarkerPosition] = useState({ x: -1000, y: -1000 });
    const [showMarker, setShowMarker] = useState(false);
    const [markerRelativePosition, setMarkerRelativePosition] = useState({ x: 0, y: 0 });

    // When the user clicks on the game screen...
    // Handle the clicking on the screen based on which elementName is passed to the function
    const handleSelectClick = async (e: React.MouseEvent<HTMLElement>, elementName: string) => {
        e.stopPropagation();
        if (elementName === "image") {
            setMarker(e);
        
        } else {
            // Check if we clicked on a character and correctly identified it.
            const response = await isCharacter(elementName);
            
            if (response.result === true) {
                // Character was identified correctly
                const newFoundCharacters = { ...foundCharacters, [`${elementName}`]: true }
                setFoundCharacters(newFoundCharacters);
                //
                setSolutions({ ...solutions, [`${response.character}`]: response.solution })

                // Check if game is over
                if (newFoundCharacters.waldo && newFoundCharacters.yeldo && newFoundCharacters.wizzard) {
                    // The game is over, close the session and change game state.
                    closeGameSession();

                    // Scroll the window back up so the player sees their score.
                    window.scrollTo(0, 0);
                }
            }
            setShowMarker(false);            
        }
    }

    // Sets the marker on the screen according to the player's click location, or unsets when clicked again.
    const setMarker = (e :React.MouseEvent<HTMLElement>) => {
        const element = e.target as HTMLElement;

        if (element.classList.contains("marker")) { 
            // If we click on the marker that is already set, unset it
            setShowMarker(false);
            
        } else {
            // Set a new marker according to the mouse coordinates.
            const rect = e.currentTarget.getBoundingClientRect();
            setShowMarker(true);
            setMarkerRelativePosition({ x: (e.clientX - rect.left) / e.currentTarget.offsetWidth, y: (e.clientY - rect.top) / e.currentTarget.offsetHeight });
            setMarkerPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }
    }

    // Make a request to check if the coordinates clicked correspond to the selected character's coordinates.
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

    // Requests a session close to the server and sets the local game state to "end".
    const closeGameSession = async () => {
        try {
            const response = await fetch(apiURL + "/session/close", {
                mode: "cors",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({id: session!._id})
            })
            
            if (response.status >= 400) {
                throw new Error("An error has ocurred while attemping to close end Game");
            }

            const result = await response.json();

            if (result.score !== null) {
                // Received a score object, set the game to the end stage and store the score.
                setGameState("end");
                setScore({time: result.totalTime, id: result._id});
            } else {
                throw new Error("Failed retrieving score from server.")
            }

            
        } catch (error) {
            setError(error as Error);
        }
    }

    // On the page initial load...
    // Start a game session
    useEffect(() => {
        // When the component is loaded, request a game session start
        const startGameSession = async () => {
            try {
                setGameState("ongoing");
                const response = await fetch(apiURL + "/session/start", {
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

        // Cancels the current game sessions by fetch request.
        const cancelGameSession = async () => {
            if (session !== null) {
                try {
                    const response = await fetch(apiURL + "/session/cancel", {
                        mode: "cors",
                        method: "DELETE",
                        headers: {
                            "Content-Type":"application/json"
                        },
                        body: JSON.stringify({id: session._id})
                    })

                    if (response.status >= 400 && response.status !== 404) {
                        throw new Error("Couldn't properly close game session");
                    }

                } catch (error) {
                    setError(error as Error);                   
                }                
            }
        }

        // On component mount, request a session open
        if(session===null) startGameSession();

        // On component dismount request a session cancel.
        return () => {
            cancelGameSession();
        }

    },[session])

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
            <div className="text-5xl relative">
                {
                    gameState === "ongoing" && <Timer />||
                    gameState === "end" && <SaveUsername score={score} handlePlayAgain={() => navigate("/")}/>
                }                    
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