import { useEffect, useState } from "react";


export default function Timer({active=true}:{ active?: boolean}) {
    const [startTime, setStartTime] = useState<null | Date>(null);
    const [currentTime, setCurrentTime] = useState<string>("");

    useEffect(() => {
        setStartTime(new Date());
        setCurrentTime(printTime(0));
    },[]);
    
    const printTime = (time: number) => {
        const timeInSeconds = Math.trunc(time / 1000);
        const timeMinutes = Math.trunc(timeInSeconds / 60);
        const timeSecs = Math.trunc(timeInSeconds % 60);
        return `${timeMinutes}m ${timeSecs}s`
    }
    setInterval(() => {
        if (startTime !== null && active === true) {
            const newTime = printTime(new Date().getTime() - startTime.getTime())
            setCurrentTime(newTime);
        }
    }, 100);
    
    return (currentTime &&
        <p>
            {currentTime}
        </p>
    )

}