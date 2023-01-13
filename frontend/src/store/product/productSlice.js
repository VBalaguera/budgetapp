import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  products: [],
  isLoadingProducts: true,
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
      state.isLoadingProducts = true
    },
    [getProducts.fulfilled]: (state, action) => {
      state.isLoadingProducts = false
      state.products = action.payload
    },
    [getProducts.rejected]: (state, action) => {
      state.isLoadingProducts = false
    },
  },
})

export default productsSlice.reducer
