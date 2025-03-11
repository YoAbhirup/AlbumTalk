import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './Home'
import Albums from './Albums'
import AlbumPage from './AlbumPage'
import {Routes, Route} from "react-router-dom"

function App() {
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/albums" element={<Albums/>}/>
        <Route path="/albumpage" element={<AlbumPage/>}/>
      </Routes>
    </>
  )
}

export default App