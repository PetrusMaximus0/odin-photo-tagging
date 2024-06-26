import ReactDOM from 'react-dom/client'
import './index.scss'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

//
import { routes } from './routes';
const router = createBrowserRouter(routes);

//
ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
