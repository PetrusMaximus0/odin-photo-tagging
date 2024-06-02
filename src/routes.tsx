import App from "./App"
import Leaderboard from "./components/Leaderboard"
import Game from "./components/Game"
import { Navigate } from "react-router-dom"

export const routes = [
  {
    path: "/",
    element: <App />,
    children: [
        {
            path: "/",
            element: <Navigate to="/play"/>
        },
        {
            path: "/play",
            element: <Game/>
        },
        {
            path: "/leaderboard",
            element: <Leaderboard/>
        },
    ]
  }
]