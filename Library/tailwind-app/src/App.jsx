import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Layout from './components/common/Layout'
import List from './pages/board/List'
import Insert from './pages/board/Insert'
import Read from './pages/board/Read'
import Update from './pages/board/Update'


function App() {
  return ( 
    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <Home /> }></Route>
        <Route element={ <Layout /> }>
          <Route path='/boards' element={ <List /> }></Route>
          <Route path='/boards/insert' element={ <Insert /> }></Route>
          <Route path='/boards/:id' element={ <Read /> }></Route>
          <Route path='/boards/update/:id' element={ <Update /> }></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App