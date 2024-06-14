import { ChangeEvent, useState } from "react";
import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

const apiURL = import.meta.env.VITE_API_URL;

export default function SaveUsername({ handlePlayAgain, score }:{handlePlayAgain: ()=>void, score: {time: number, id: string}}) {
    
    const [formData, setFormData] = useState<string>("");
    const [error, setError] = useState<null|Error>(null)
    const navigate = useNavigate();

    //
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {            
            const result = await fetch(apiURL + "/session/save-user", {
                mode: "cors",
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({id: score.id, username: formData})
            })

            if (result.status >= 400) {
                throw new Error ("Error saving username.")
            }
            navigate("/"); 
                
        } catch (error) {
            setError(error as Error);
        }          
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData(e.currentTarget.value);
    }
    
    // Receives time in miliseconds
    const printTime = (time: number) => {
        const timeInSeconds = Math.trunc(time / 1000);
        const timeMinutes = Math.trunc(timeInSeconds / 60);
        const timeSecs = Math.trunc(timeInSeconds % 60);
        return `${timeMinutes}m ${timeSecs}s`
    }

    return (        
            !error && <>
                <p> Your score is {printTime(score.time)} Enter username? </p>
                <form className="flex items-center justify-center text-lg gap-2" onSubmit={(e)=>handleSubmit(e)} action="">
                    <label htmlFor="username">
                        <input onChange={e => handleInputChange(e)} value={formData} type="text" name="username" id="username" />
                    </label>
                    <button type="submit"> Confirm </button>
                    <button type="button" onClick={handlePlayAgain}> Play Again </button>
                </form>
            </>
            || error && <p>{error.message}</p>
        )
}