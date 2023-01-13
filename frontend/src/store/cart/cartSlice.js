import { createSlice } from '@reduxjs/toolkit'

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
      // console.log('action.payload', action)

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

      state.cartItems = state.cartItems.filter((item) => item._id !== itemId)
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
    },

    setItemQuantity: (state, { payload }) => {
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
