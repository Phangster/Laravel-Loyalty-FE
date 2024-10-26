import './styles/app.css'

import Register from './pages/Auth/Register'
import Home from './pages/Home'
import Layout from './pages/Layout'
import Login from './pages/Auth/Login'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext, AppContextType } from './context/AppContext'
import Create from './pages/Items/Create'
import Show from './pages/Items/Show'
import Update from './pages/Items/Update'

const App = () => {
  const { user } = useContext(AppContext) as AppContextType;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/register" element={user ? <Home /> : <Register />} />
          <Route path="/login" element={user ? <Home /> : <Login />} />
          <Route path="/create" element={user ? <Create /> : <Login />} />
          <Route path="/items/:id" element={<Show />} />
          <Route path="/items/update/:id" element={user ? <Update /> : <Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
