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
