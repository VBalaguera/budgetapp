import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BudgetsProvider } from './context/BudgetsContext'
import { NotesProvider } from './context/NotesContext'
import './App.css'

import './i18n'

ReactDOM.render(
  <React.StrictMode>
    <NotesProvider>
      <BudgetsProvider>
        <App />
      </BudgetsProvider>
    </NotesProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
