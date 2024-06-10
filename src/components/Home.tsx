
import { Link } from "react-router-dom"

export default function Home() {
    return (
        <Link
            className="text-5xl hover:bg-slate-700 px-6 min-w-44 py-2 rounded text-white hover:text-orange-500"
            to="/play">
                
            Start
        </Link>
    )
    
}