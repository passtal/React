import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Join from './pages/Join'
import User from './pages/User'
import About from './pages/About'
import Admin from './pages/Admin'
import LoginContextProvider from './contexts/LoginContextProvider'
import ProtectedRoute from './components/common/ProtectedRoute'

function App() {

  return (
    <BrowserRouter>
      <LoginContextProvider>
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/join' element={<Join />}></Route>
          <Route path='/user' element={
            <ProtectedRoute roles={['ROLE_USER']}>
              <User />
            </ProtectedRoute>
            }></Route>
          <Route path='/about' element={<About />}></Route>
          <Route path='/admin' element={
            <ProtectedRoute roles={['ROLE_ADMIN']}>
              <Admin />
            </ProtectedRoute>
            }></Route>
        </Routes>
      </LoginContextProvider>
    </BrowserRouter>
  )
}

export default App
