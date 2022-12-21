## Axios

For fetching from the api.

```sh

npm install axios
```

## GET DATA FROM THE BACKEND TO THE FRONT-END

CORS PROBLEM:

Set url http://127.0.0.1:8000/api/

```sh
pip install django-cors-headers
```

Add 'corsheaders' to INSTALLED_APPS.

Set CORS_ALLOWED_ORIGINS later. Now CORS_ALLOW_ALL_ORIGINS= True

Add 'corsheaders.middleware.CorsMiddleware' to MIDDLEWARE.

And in the front-end side:

```js
import axios from 'axios'
  let [backendNotes, setBackendNotes] = useState([])

  useEffect(() => {
    fetchNotes()
  }, [])

  let fetchNotes = async () => {
    const { data } = await axios.get('http://127.0.0.1:8000/api/notes/')
    setBackendNotes(data)
  }
[...]
 <>
            {backendNotes.map((note, index) => (
              <li key={index}>{note.body}</li>
            ))}
          </>
```

To make axios calls simpler, add this into package.json:

```js
"proxy": "http://127.0.0.1:8000/",
```

React will use that port as proxy.

## GETTING INDIVIDUAL NOTES:

Created pages/notes/[id.js]:

```js
import React, { useState, useEffect } from 'react'

import axios from 'axios'
import { useParams } from 'react-router-dom'

const SingleNote = () => {
  const pathname = useParams()
  console.log(pathname)
  // notes from backend
  let [backendNote, setBackendNote] = useState([])

  useEffect(() => {
    fetchNote()
  }, [])

  let fetchNote = async () => {
    const { data } = await axios.get(`/api/notes/${pathname.id}`)
    setBackendNote(data)
  }
  return <div>SingleNote here: {backendNote.title}</div>
}

export default SingleNote
```

## REDUX SETUP

Redux toolkit DOCS: https://redux-toolkit.js.org/tutorials/quick-start

1. Installation

```sh
npm install @reduxjs/toolkit react-redux redux-thunk
```

2. Set the store in the app root dir:

app/src/store.js:

```js
import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {},
})
```

3. Provide it where App is. In this case: src/index.js:

```js
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
              <Route path='/notes/:id' element={<SingleNote />}></Route>
            </Routes>
          </BrowserRouter>
        </BudgetsProvider>
      </NotesProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
```

4. Create a Redux State Slice:

In this case, related to the user.
It will be located at src/features/user/userSlice.js:

```js
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
})

export const {} = userSlice.actions

export default userSlice.reducer
```

5. Add Slice Reducers to the Store:

Bring that userSlice to the Store in src/store.js:

```js
import { configureStore } from '@reduxjs/toolkit'
import userReducer from './features/user/userSlice'
import thunk from 'redux-thunk'

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
  middleware: [thunk],
})
```

And done.

## NOTES AND PRODUCTS REDUX FUNCTIONALITY:

### PRODUCTS LIST REDUCER AND ACTION

1. Create a slice reducer in features/product/productSlice:

```js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  products: [],
  isLoading: true,
}

const urlApi = '/api/products/'

export const getProducts = createAsyncThunk('cart/getProducts', async () => {
  try {
    const { data } = await axios.get(urlApi)

    return data
  } catch (error) {
    console.log('Something went wrong')
    console.log(error)
  }
})

const productsSlice = createSlice({
  name: 'products',
  initialState,
  extraReducers: {
    // lifecycle actions here
    [getProducts.pending]: (state) => {
      state.isLoading = true
    },
    [getProducts.fulfilled]: (state, action) => {
      console.log(action)
      state.isLoading = false
      state.products = action.payload
    },
    [getProducts.rejected]: (state, action) => {
      console.log(action)
      state.isLoading = false
    },
  },
})

export default productsSlice.reducer
```

2. Bring it into the store.js:

```js
import { configureStore } from '@reduxjs/toolkit'
import userReducer from './features/user/userSlice'
import productsReducer from './features/product/productSlice'
import thunk from 'redux-thunk'

export const store = configureStore({
  reducer: {
    user: userReducer,
    products: productsReducer,
  },
  middleware: [thunk],
})
```

3. Use it in any page where needed:

```js
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getProducts } from '../features/product/productSlice'

function MainPage() {
  const dispatch = useDispatch()
  const { isLoading, products } = useSelector((store) => store.products)

  useEffect(() => {
    dispatch(getProducts())
  }, [dispatch])

  return (
    <div>
      <h3>welcome</h3>
      {isLoading ? (
        <span>loading</span>
      ) : (
        <>
          {products.map((product) => (
            <>
              <span>{product.name}</span>
            </>
          ))}
        </>
      )}
    </div>
  )
}

export default MainPage
```

## CART SLICE

Let's create features/cart/cartSlice.js:

```js
import { createSlice } from '@reduxjs/toolkit'

// TODO: make cart persists after refreshing page
const cartItems = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : []

const initialState = {
  cartItems: cartItems,
  amount: 0,
  total: 0,
  isLoadingCart: true,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = []
      localStorage.removeItem('cartItems')
    },

    addToCart: (state, action) => {
      // check if cart exists in localstorage
      let cart = []
      if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cartItems'))
      }

      // item to add to cart
      const newItem = action.payload
      const itemInCart = state.cartItems.find(
        (item) => item._id === newItem._id
      )
      if (itemInCart) {
        itemInCart.amount += 1
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
      } else {
        state.cartItems.push({ ...newItem, amount: 1 })
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
      }
    },

    removeItem: (state, action) => {
      // state, payload
      const itemId = action.payload
      console.log(action)
      state.cartItems = state.cartItems.filter((item) => item._id !== itemId)
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
    },

    increaseItem: (state, { payload }) => {
      const cartItem = state.cartItems.find((item) => item._id === payload)
      cartItem.amount = cartItem.amount + 1
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
    },

    decreaseItem: (state, { payload }) => {
      const cartItem = state.cartItems.find((item) => item._id === payload)
      cartItem.amount = cartItem.amount - 1
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
    },

    calculateTotals: (state) => {
      let amount = 0
      let total = 0
      state.cartItems.forEach((item) => {
        amount += item.amount
        total += item.amount * item.price
      })
      state.amount = amount
      state.total = total
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
    },
  },
})

export const {
  addToCart,
  clearCart,
  removeItem,
  increaseItem,
  decreaseItem,
  calculateTotals,
} = cartSlice.actions
export default cartSlice.reducer
```

Then, implement that magic into MainPage.js:

```js
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getProducts } from '../features/product/productSlice'
import { getNotes } from '../features/note/noteSlice'

import {
  addToCart,
  increaseItem,
  decreaseItem,
  removeItem,
} from '../features/cart/cartSlice'

// in the meantime, this route is /test
function MainPage() {
  const [quantity, setQuantity] = useState(1)

  const dispatch = useDispatch()
  const { isLoadingProducts, products } = useSelector((store) => store.products)
  const { isLoadingNotes, notes } = useSelector((store) => store.notes)

  useEffect(() => {
    dispatch(getProducts())
    dispatch(getNotes())
  }, [dispatch])

  return (
    <div className='container'>
      <h3>welcome</h3>

      {isLoadingProducts ? (
        <span>loading</span>
      ) : (
        <>
          <div className='d-flex flex-column w-100'>
            <h1>products</h1>
            {products.map((product) => (
              <>
                <span>{product.name}</span>
                {product.countInStock > 0 ? (
                  <>
                    <button onClick={() => dispatch(addToCart(product))}>
                      add to cart
                    </button>
                  </>
                ) : (
                  <span>sold out</span>
                )}
                {/* TODO: make this work */}
                {/* {product.countInStock > 0 && (
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  >
                    {[...Array(product.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                )} */}
              </>
            ))}
          </div>
        </>
      )}
      {isLoadingNotes ? (
        <span>loading</span>
      ) : (
        <>
          <div className='d-flex flex-column w-100 '>
            <h1>notes</h1>{' '}
            {notes.map((note) => (
              <>
                <div className='card my-2 p-3'>
                  <span>{note.title}</span>
                  <img
                    src={note.image}
                    alt={note.title}
                    style={{ height: 'auto', width: '200px' }}
                  />
                </div>
              </>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default MainPage
```

Let's create CartPage.js. The route is /cart:

```js
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  clearCart,
  addToCart,
  increaseItem,
  decreaseItem,
  removeItem,
  calculateTotals,
} from '../features/cart/cartSlice'

import ProductCard from '../components/ProductCard/ProductCard'

const CartPage = () => {
  const dispatch = useDispatch()
  const { cartItems, amount, total } = useSelector((state) => state.cart)
  useEffect(() => {
    dispatch(calculateTotals())
  }, [dispatch, cartItems])
  return (
    <div>
      <div>
        {cartItems.map((product, index) => (
          <ProductCard product={product} />
        ))}
      </div>
      <strong>total: ${total.toFixed(2)}</strong>
      <button onClick={() => dispatch(clearCart())}>clear cart</button>
    </div>
  )
}

export default CartPage

/* 

Today she and her brother reached the neighbors about the humidity stain.
A plumber, sent by the insurance company, has spoken with the neighbors. 
*/
```

And ProductCard.js:

```js
import { useDispatch, useSelector } from 'react-redux'
import {
  increaseItem,
  decreaseItem,
  removeItem,
} from '../../features/cart/cartSlice'

const ProductCard = ({ product }) => {
  const dispatch = useDispatch()

  console.log(product)

  return (
    <div>
      <div>
        <span>{product.name}</span>
        <button
          className='amount-btn'
          onClick={() => {
            dispatch(increaseItem(product._id))
          }}
        >
          +
        </button>
        <span>{product.amount}</span>
        <button
          className='amount-btn'
          onClick={() => {
            if (product.amount === 1) {
              dispatch(removeItem(product._id))
              return
            }
            dispatch(decreaseItem(product._id))
          }}
        >
          -
        </button>
      </div>
    </div>
  )
}

export default ProductCard
```

## USING LOCALSTORAGE FOR BANNERS AND OTHER NOTIFICATIONS

I must warn all users that, when using the site, I require to use localstorage in order to guarantee some functionalities. To do this, I will create a localStorage property called "showedCookiesBanner".
By default its value will be false. It will be used in the <Layout/> component.

ADDENDUM: how to maintain a color theme between pages (and also how to show a banner to inform about cookies):

```js
const [showCookieBanner, setShowCookieBanner] = useState(true)

const [theme, setTheme] = useState('light')

const themeToggler = () => {
  if (theme === 'light') {
    setTheme('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    setTheme('light')
    localStorage.setItem('theme', 'light')
  }
}

const hideCookieBanner = () => {
  localStorage.setItem('cookieBanner', 'false')
  setShowCookieBanner(false)
}

useEffect(() => {
  fetchNotes()

  // theme
  const theme = localStorage.getItem('theme')
  setTheme(theme)

  // checking if cookieBanner was shown
  const cookieBanner = localStorage.getItem('cookieBanner')
  console.log('cookieBanner', cookieBanner)
  if (cookieBanner !== null) {
    setShowCookieBanner(JSON.parse(cookieBanner))
  }
}, [])
```

## USER SLICE

<!-- this is a work in progress -->

frontend/src/features/user/userSlice.js

```js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

import AuthService from '../../services/auth.service'

const user = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null

const initialState = user
  ? { isLoadingUser: false, user }
  : { isLoadingUser: true, user: null }

const urlApi = '/api/users/login/'

export const userLogin = createAsyncThunk(
  'user/userLogin',
  async ({ username, password }) => {
    try {
      console.log(username, password)
      const data = await AuthService.login(username, password)
      console.log('welcome')
      return { user: data }
    } catch (err) {
      console.log(err)
    }
  }
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // lifecycle actions here
    [userLogin.pending]: (state) => {
      state.isLoadingUser = true
    },
    [userLogin.fulfilled]: (state, action) => {
      console.log(action)
      state.isLoadingUser = false
      state.user = action.payload.user
    },
    [userLogin.rejected]: (state, action) => {
      console.log(action)
      state.isLoadingUser = false
    },
  },
})

export default userSlice.reducer
```

For this, I am using this newly created AuthService:
frontend/src/services/auth.service.js

```js
import axios from 'axios'

const API_URL = 'http://127.0.0.1:8000/api/users/'

const signup = (username, email, password) => {
  return axios.post(API_URL + 'register/', {
    username,
    email,
    password,
  })
}

const login = (username, password) => {
  return axios
    .post(API_URL + 'login/', {
      username,
      password,
    })
    .then((response) => {
      if (response.data.access) {
        localStorage.setItem('userInfo', JSON.stringify(response.data))
      }

      return response.data
    })
}

const logout = () => {
  localStorage.removeItem('user')
}

const AuthService = {
  signup,
  login,
  logout,
}

export default AuthService
```

//
//
//
//
## USER SIGNUP AND LOGOUT:

I am going to modify user_views.py to include a name field when users register:

```py

# register users
@api_view(['POST'])
def registerUser(request):
    data = request.data

    try:
        user = User.objects.create(

            first_name=data['name'],

            email=data['email'],
            username=data['email'],

            # password requires hashing
            password=make_password(data['password'])

            # todo:
            # - make user type password twice, check them out


        )

        serializer = UserSerializerWithToken(user, many=False)

        return Response(serializer.data)

    except:
        message = {'detail': 'User with this email already exists'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

```

Now, I am going to create a message slice so I can inform users what's going on when registering, logging in, and so on:

newly created features/message/messageSlice.js:

```js
import { createSlice } from '@reduxjs/toolkit'

const initialState = {}

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setMessage: (state, action) => {
      return { message: action.payload }
    },
    clearMessage: () => {
      return { message: '' }
    },
  },
})

const { reducer, actions } = messageSlice

export const { setMessage, clearMessage } = actions

export default reducer
```

Then, incorporate it into src/store.js:

```js
import { configureStore } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'

import userReducer from './features/user/userSlice'
import productsReducer from './features/product/productSlice'
import notesReducer from './features/note/noteSlice'
import cartReducer from './features/cart/cartSlice'
import messageReducer from './features/message/messageSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    products: productsReducer,
    notes: notesReducer,
    cart: cartReducer,
    message: messageReducer,
  },
  middleware: [thunk],
})
```

auth.service.js recap:

```js
import axios from 'axios'

const API_URL = 'http://127.0.0.1:8000/api/users/'

const signup = (name, username, password) => {
  return axios.post(API_URL + 'register/', {
    name,
    email: username,
    username,
    password,
  })
}

const login = (username, password) => {
  return axios
    .post(API_URL + 'login/', {
      username,
      password,
    })
    .then((response) => {
      if (response.data.access) {
        localStorage.setItem('userInfo', JSON.stringify(response.data))
      }

      return response.data
    })
}

const logout = () => {
  localStorage.removeItem('userInfo')
  console.log('goodbye')
}

const AuthService = {
  signup,
  login,
  logout,
}

export default AuthService
```

Import it into userSlice.js:

```js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import AuthService from '../../services/auth.service'

import { setMessage } from '../message/messageSlice'

const user = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null

const initialState = user
  ? { isLoggedIn: true, user }
  : { isLoggedIn: false, user: null }

export const login = createAsyncThunk(
  'user/userLogin',
  async ({ email, password }, thunkAPI) => {
    try {
      console.log(email, password)
      const data = await AuthService.login(email, password)
      thunkAPI.dispatch(setMessage('welcome back'))
      console.log('welcome back')
      return { user: data }
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.response.data.detail ||
        error.message ||
        error.toString()
      thunkAPI.dispatch(setMessage(message))
      console.log(message)
      return thunkAPI.rejectWithValue()
    }
  }
)

export const signup = createAsyncThunk(
  'user/userSignup',
  async ({ name, username, password }, thunkAPI) => {
    try {
      console.log(name, username, password)
      const response = await AuthService.signup(name, username, password)
      thunkAPI.dispatch(
        setMessage('welcome! you can now login with your credentials!')
      )
      console.log('welcome! you can now login with your credentials!')
      return response.data
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.response.data.detail ||
        error.message ||
        error.toString()
      thunkAPI.dispatch(setMessage(message))
      console.log(message)
      return thunkAPI.rejectWithValue()
    }
  }
)

export const logout = createAsyncThunk('user/userLogout', async () => {
  await AuthService.logout()
})

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // lifecycle actions here
    [signup.fulfilled]: (state, action) => {
      state.isLoggedIn = false
    },
    [signup.rejected]: (state, action) => {
      state.isLoggedIn = false
    },
    [login.fulfilled]: (state, action) => {
      state.isLoggedIn = true
      state.user = action.payload.user
    },
    [login.rejected]: (state, action) => {
      state.isLoggedIn = false
      state.user = null
    },
    [logout.fulfilled]: (state, action) => {
      state.isLoggedIn = false
      state.user = null
    },
  },
})

export default userSlice.reducer
```

Implementation into SignUpPage.js:

```js
import { useState, useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { useNavigate } from 'react-router-dom'

import Layout from '../../components/Layout/Layout'

import { signup } from '../../features/user/userSlice'

import { clearMessage } from '../../features/message/messageSlice'

const SignUpPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState(false)

  const userData = useSelector((state) => state.user)
  const { user } = userData
  const messageData = useSelector((state) => state.message)
  const { message } = messageData
  const registerForm = (e) => {
    e.preventDefault()
    console.log(name, username, password)
    dispatch(signup({ name, username, password }))
      .unwrap()
      .then(() => {
        setTimeout(() => navigate('/login'), 2000)
      })
      .catch(() => {
        setError(true)
        console.log('error')
      })
  }

  useEffect(() => {
    dispatch(clearMessage())
    if (user) {
      navigate('/')
    }
  }, [user, navigate, dispatch])

  return (
    <Layout>
      <h1>register or login</h1>

      <form onSubmit={registerForm}>
        <div>
          {' '}
          <label>username</label>
          <input
            value={name}
            placeholder='your username'
            required={true}
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>
        <div>
          {' '}
          <label>email</label>
          <input
            value={username}
            placeholder='your email'
            required={true}
            onChange={(e) => setUsername(e.target.value)}
          ></input>
        </div>
        <div>
          {' '}
          <label>password</label>
          <input
            value={password}
            placeholder='your password'
            required={true}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        <div className='d-flex flex-column'>
          {message ? (
            <div
              className={error ? 'alert alert-danger' : 'alert alert-success'}
            >
              <span>{message}</span>
            </div>
          ) : null}
        </div>
        <button type='submit'>login</button>
      </form>
    </Layout>
  )
}

export default SignUpPage
```

Updating on LoginPage.js:

```js
import { useState, useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'

import Layout from '../../components/Layout/Layout'

import { login, signup } from '../../features/user/userSlice'
import { clearMessage } from '../../features/message/messageSlice'

const LoginPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState(false)

  const userData = useSelector((state) => state.user)
  const { user } = userData

  const messageData = useSelector((state) => state.message)
  const { message } = messageData

  useEffect(() => {
    dispatch(clearMessage())
    if (user !== null) {
      navigate('/')
    }
  }, [user, navigate, dispatch])

  const submitForm = (e) => {
    e.preventDefault()
    console.log(email, password)
    dispatch(login({ email, password }))
      .unwrap()
      .then(() => {
        setTimeout(() => window.location.reload(), 2000)
      })
      .catch(() => {
        console.log('error')
      })
  }

  return (
    <Layout>
      <div>LoginPage</div>
      <h1>register or login</h1>

      {/* login form */}
      <form onSubmit={submitForm}>
        <div>
          {' '}
          <label>email</label>
          <input
            value={email}
            placeholder='your email'
            required={true}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
        <div>
          {' '}
          <label>password</label>
          <input
            value={password}
            placeholder='your password'
            required={true}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        <div className='d-flex flex-column'>
          {message ? (
            <div
              className={error ? 'alert alert-danger' : 'alert alert-success'}
            >
              <span>{message}</span>
            </div>
          ) : null}
        </div>
        <button type='submit'>login</button>
      </form>

      {/* signup form */}
    </Layout>
  )
}

export default LoginPage
```

LogOut implementation into Layout:

```js
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Stack } from 'react-bootstrap'
import Container from 'react-bootstrap/Container'
import { Link } from 'react-router-dom'

import '../../App.css'
import AddBudgetModal from '../AddBudgetmodal/AddBudgetModal'
import AddExpenseModal from '../AddExpenseModal/AddExpenseModal'

import ViewExpensesModal from '../ViewExpensesModal/ViewExpensesModal'
import '../../styles/Buttons.css'
import '../../styles/Typography.css'
/* import Lessons from "./components/Lessons/Lessons"; */
import { ThemeProvider } from 'styled-components'
import { lightTheme, darkMode, GlobalStyles } from '../../themes'
import Footer from '../Footer/Footer'

// NOTES UPGRADE:
import AddNoteModal from '../AddNoteModal/AddNoteModal'

// i18n:
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../Layout/LanguageSwitcher/LanguageSwitcher'

// backend data
import axios from 'axios'

import { logout } from '../../features/user/userSlice'

function Layout({ children }) {
  const dispatch = useDispatch()

  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false)
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false)
  const [viewExpensesModalBudgetId, setViewExpensesModalBudgetId] = useState()
  const [showAddExpenseModalBudgetId, setShowAddExpenseModalBudgetId] =
    useState()

  const [showCookieBanner, setShowCookieBanner] = useState(true)

  function openAddExpenseModal(budgetId) {
    setShowAddExpenseModal(true)
    setShowAddExpenseModalBudgetId(budgetId)
  }

  const [showAddNoteModal, setShowAddNoteModal] = useState(false)

  // dark mode here:
  const [theme, setTheme] = useState('light')

  const themeToggler = () => {
    if (theme === 'light') {
      setTheme('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      setTheme('light')
      localStorage.setItem('theme', 'light')
    }
  }

  // i18n:
  const { t } = useTranslation()

  // notes from backend
  let [backendNotes, setBackendNotes] = useState([])

  const hideCookieBanner = () => {
    localStorage.setItem('cookieBanner', 'false')
    setShowCookieBanner(false)
  }

  useEffect(() => {
    fetchNotes()

    // theme
    const theme = localStorage.getItem('theme')
    setTheme(theme)

    // checking if cookieBanner was shown
    const cookieBanner = localStorage.getItem('cookieBanner')
    console.log('cookieBanner', cookieBanner)
    if (cookieBanner !== null) {
      setShowCookieBanner(JSON.parse(cookieBanner))
    }
  }, [])

  let fetchNotes = async () => {
    const { data } = await axios.get('/api/notes/')
    setBackendNotes(data)
  }

  const { user: user } = useSelector((state) => state.user)

  const logOut = (e) => {
    e.preventDefault()
    dispatch(logout())
      .unwrap()
      .then(() => {
        setTimeout(() => window.location.reload(), 2000)
      })
      .catch(() => {
        console.log('error')
      })
  }

  return (
    <>
      <ThemeProvider theme={theme === 'light' ? lightTheme : darkMode}>
        <GlobalStyles />
        <Container className='my-4'>
          {/* navbar */}
          <Stack direction='horizontal' gap='2' className='mb-4'>
            <div className='header'>
              <div className='header__title'>
                <div className='d-flex justify-content-start'>
                  <Link to='/'>
                    <h1 className='carrington-c'>C</h1>
                    <h1>arrington</h1>
                  </Link>
                </div>
              </div>
              <div className='header__links'>
                <button
                  className='header__links-btn'
                  onClick={() => themeToggler()}
                >
                  {theme === 'light' ? (
                    <>{t('main.dark')}</>
                  ) : (
                    <>{t('main.light')}</>
                  )}
                </button>
                <LanguageSwitcher />
                <button
                  className='header__links-btn'
                  variant='outline-primary'
                  onClick={() => setShowAddBudgetModal(true)}
                >
                  {t('buttons.addBudget')}
                </button>
                <button
                  className='header__links-btn'
                  variant='outline-primary'
                  onClick={() => setShowAddNoteModal(true)}
                >
                  {t('buttons.addNote')}
                </button>
                <button
                  className='header__links-btn'
                  variant='outline-primary'
                  onClick={openAddExpenseModal}
                >
                  {t('buttons.addExpense')}
                </button>
                {user ? (
                  <div className='d-flex align-items-center'>
                    <span>{user.name}</span>
                    <button
                      className='header__links-btn'
                      variant='outline-primary'
                      onClick={logOut}
                    >
                      logout
                    </button>
                  </div>
                ) : (
                  <div>
                    <Link to='/login'>
                      <button
                        className='header__links-btn'
                        variant='outline-primary'
                      >
                        login
                      </button>
                    </Link>
                    <Link to='/signup'>
                      <button
                        className='header__links-btn'
                        variant='outline-primary'
                      >
                        signup
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </Stack>
          {/*  */}
          {showCookieBanner && (
            <div className='d-flex flex-column my-2'>
              <span>
                This site uses cookies only for functionality purposes.
              </span>
              <button
                className='btn btn-primary'
                onClick={() => hideCookieBanner()}
              >
                click here to hide banner
              </button>
            </div>
          )}
          <main>{children}</main>
        </Container>
        <AddBudgetModal
          show={showAddBudgetModal}
          handleClose={() => setShowAddBudgetModal(false)}
        />
        <AddNoteModal
          show={showAddNoteModal}
          handleClose={() => setShowAddNoteModal(false)}
        />
        <AddExpenseModal
          show={showAddExpenseModal}
          defaultBudgetId={showAddExpenseModalBudgetId}
          handleClose={() => setShowAddExpenseModal(false)}
        />
        <ViewExpensesModal
          budgetId={viewExpensesModalBudgetId}
          handleClose={() => setViewExpensesModalBudgetId()}
        />
        <Footer />
      </ThemeProvider>
    </>
  )
}

export default Layout
```
