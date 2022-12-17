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

const register = (username, email, password) => {
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
  register,
  login,
  logout,
}

export default AuthService
```
