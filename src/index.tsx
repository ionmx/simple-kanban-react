import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom"
import './index.css'
import Navbar from './components/Navbar'
import App from './App'
import Board from "./routes/board"

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)
root.render(
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="board">
          <Route path=":id" element={<Board />} />
        </Route>
      </Routes>
    </BrowserRouter>
)