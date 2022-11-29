import { configureStore } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'

import userReducer from './features/user/userSlice'
import productsReducer from './features/product/productSlice'
import notesReducer from './features/note/noteSlice'
import cartReducer from './features/cart/cartSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    products: productsReducer,
    notes: notesReducer,
    cart: cartReducer,
  },
  middleware: [thunk],
})
