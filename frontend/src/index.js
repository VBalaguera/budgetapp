import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import SingleNote from './pages/notes/[id]'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BudgetsProvider } from './context/BudgetsContext'
import { NotesProvider } from './context/NotesContext'
import './App.css'

import { BrowserRouter, Routes, Switch, Route, Link } from 'react-router-dom'

import './i18n'

ReactDOM.render(
  <React.StrictMode>
    <NotesProvider>
      <BudgetsProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<App />}></Route>
            <Route path='/notes/:id' element={<SingleNote />}></Route>
          </Routes>
        </BrowserRouter>
      </BudgetsProvider>
    </NotesProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
