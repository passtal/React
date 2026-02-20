import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Board from './pages/Board'
import Login from './pages/Login'
import Admin from './pages/Admin'

function App() {
  // state
  const [isLogin, setIsLogin] = useState(true)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={ <Home /> }></Route>
          <Route path='/about' element={ <About /> }></Route>
          <Route path='/boards/:id' element={ <Board /> }></Route>
          <Route path='/login' element={ <Login /> }></Route>
          <Route path='/admin' element={ isLogin ? <Admin />
                : <Navigate to="/login" /> }></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App