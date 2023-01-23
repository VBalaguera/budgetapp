import { configureStore } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'

import userReducer from './store/user/userSlice'
import productsReducer from './store/product/productSlice'
import notesReducer from './store/note/noteSlice'
import cartReducer from './store/cart/cartSlice'
import messageReducer from './store/message/messageSlice'
import dayPostsReducer from './store/day_post/day_postSlice'

import transactionReducer from './store/transaction/transactionSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    products: productsReducer,
    notes: notesReducer,
    cart: cartReducer,
    message: messageReducer,
    dayPosts: dayPostsReducer,
    transactions: transactionReducer,
  },
  middleware: [thunk],
})
