import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import MainPage from './pages/MainPage'
import SingleNote from './pages/notes/[id]'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BudgetsProvider } from './context/BudgetsContext'
import { NotesProvider } from './context/NotesContext'
import './App.css'

import { BrowserRouter, Routes, Switch, Route, Link } from 'react-router-dom'

import { store } from './store'
import { Provider } from 'react-redux'

import './i18n'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store} r>
      <NotesProvider>
        <BudgetsProvider>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<App />}></Route>
              <Route path='/test' element={<MainPage />}></Route>
              <Route path='/notes/:id' element={<SingleNote />}></Route>
            </Routes>
          </BrowserRouter>
        </BudgetsProvider>
      </NotesProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
