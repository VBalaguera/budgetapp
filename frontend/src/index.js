import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import MainPage from './pages/MainPage'
import SingleNote from './pages/notes/[id]'
import SingleProduct from './pages/products/[id]'
import CartPage from './pages/CartPage'
import LoginPage from './pages/LoginPage/LoginPage'
import SignUpPage from './pages/SignUpPage/SignUpPage'

import TransactionsPage from './pages/TransactionsPage'
import CreateTransactionsPage from './pages/CreateTransactionsPage'
import DayPostPage from './pages/DayPostPage'
import NotesPage from './pages/NotesPage'

import 'bootstrap/dist/css/bootstrap.min.css'
import { BudgetsProvider } from './context/BudgetsContext'
import { NotesProvider } from './context/NotesContext'
import './App.css'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

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
              <Route path='/login' element={<LoginPage />}></Route>

              {/* transactions */}
              <Route
                path='/transactions/:id'
                element={<TransactionsPage />}
              ></Route>
              <Route
                path='/transactions/create'
                element={<CreateTransactionsPage />}
              ></Route>

              {/* notes */}
              <Route path='/notes/:id/' element={<NotesPage />}></Route>
              {/* <Route path='/notes/:id/:id' element={<SingleNote />}></Route> */}

              {/* day-posts */}
              {/* <Route path='/day-posts/:id' element={<DayPostPage />}></Route> */}
              <Route path='/signup' element={<SignUpPage />}></Route>
              <Route path='/cart' element={<CartPage />}></Route>

              <Route path='/products/:id' element={<SingleProduct />}></Route>
            </Routes>
          </BrowserRouter>
        </BudgetsProvider>
      </NotesProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
