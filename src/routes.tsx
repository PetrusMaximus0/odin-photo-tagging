import App from "./App"
import Leaderboard from "./components/Leaderboard"
import Game from "./components/Game"
import Home from "./components/Home"

export const routes = [
  {
    path: "/",
    element: <App />,
    children: [
        {
            path: "/",
            element: <Home/>
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