import './App.scss'
import { Link, Outlet } from 'react-router-dom'

function App() {

  return (
    <div className='grid grid-rows-[auto_1fr_auto] gap-10 h-screen'>
      <header className='py-8 bg-slate-800'>
        <nav>
          <ul className='flex justify-center'>
            <li>
              <Link
                className='text-5xl hover:bg-slate-700 px-6 min-w-44 py-2 rounded text-white hover:text-orange-500'
                to="/play" >
                 Play
              </Link>
            </li>
            <li>
              <Link
                className='text-5xl hover:bg-slate-700 px-6 min-w-44 py-2 rounded text-white hover:text-orange-500'
                to="/leaderboard" >
                Leaderboard
              </Link>
            </li>
          </ul>
        </nav>
      </header>       
      <main className='px-2'>
        <Outlet/>
      </main>
      <footer className='text-2xl flex justify-center pb-8'>
        <a href="https://github.com/PetrusMaximus0" className='text-white flex gap-2 items-center' target='_empty'>
          Petrus
            <i className="text-3xl devicon-github-original"></i>          
        </a>
      </footer>
    </div>
  )
}

export default App
