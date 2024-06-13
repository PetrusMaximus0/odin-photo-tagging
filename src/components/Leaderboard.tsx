import { useEffect, useState } from "react"

const apiURL = import.meta.env.VITE_API_URL;

interface IGameScore{
    _id: "string",
    username: "string",
    time: number,
}

export default function Leaderboard() {
    const [leaderboards, setLeaderboards] = useState<IGameScore[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    
    // Fetch the leader boards
    useEffect(() => {
        const fetchLeaderboards = async () => {
            try {
                const result = await fetch(apiURL + "/game/rankings",
                    {
                        mode: "cors",
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        }
                    })
                            
                if (result.status === 404) {
                    throw new Error("Couldn't load the leaderboards");
                }
                
                const scores = await result.json();
                setLeaderboards(scores.rankings);
                console.log(scores);

            } catch (error) {
                setError((error as Error))
            }
        }
                
        // Execute the functions
        setLoading(true);
        fetchLeaderboards();
        setLoading(false);

    }, []);

    // Receives time in miliseconds
    const printTime = (time: number) => {
        const timeInSeconds = Math.trunc(time / 1000);
        const timeMinutes = Math.trunc(timeInSeconds / 60);
        const timeSecs = Math.trunc(timeInSeconds % 60);
        return `${timeMinutes}m ${timeSecs}s`
    }

    const appendCorrectPlaceEnding = (number: number) =>{
        const numStr = number.toString();
        const lastNum = numStr[numStr.length - 1];

        if (lastNum === "1") {
            return (`${number}rst`);
        
        } else if (lastNum === "2") {
            return (`${number}nd`);
        
        } else if (lastNum === "3") {
            return (`${number}rd`);
        
        } else {
            return (`${number}th`);
        }

    }

    return (
        <section className="mx-auto max-w-xl">
            
            {
                error && <p> {error.message} </p>
                ||
                loading && <p> Loading the leaderboards !</p>
                ||
                leaderboards.length>0 &&
                (
                    <>
                        <h1>Top 10 results</h1>
                        <p className="border-b my-4 py-4 text-4xl font-light flex justify-between">
                            Username
                            <span> Total Time </span>
                        </p>            
                        <ol className="flex flex-col gap-2 text-lg font-semibold">
                            {leaderboards.map((score, index) => {
                                    return (
                                        <li key={score._id} className={` ${index===0 ? "text-3xl text-yellow-400" : index===1 ? "text-2xl text-gray-400" : index === 2 ? "text-xl text-amber-700" : "" } flex justify-between`}>
                                            {appendCorrectPlaceEnding(index + 1)} - {score.username}
                                            <span> {printTime(score.time)} </span>
                                        </li>
                                    )
                                    })                   
                            }                                
                            <li className="flex justify-between border-t pt-4 mt-4 text-xl">
                                Previous Game - {leaderboards[leaderboards.length-1].username}
                                <span> {printTime(leaderboards[leaderboards.length-1].time)} </span>
                            </li>

                        </ol>
                    </>
                )
                || <p>No games have been played yet!</p>    
        }
        
        </section>
    )
}