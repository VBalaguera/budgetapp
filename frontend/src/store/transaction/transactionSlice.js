import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import axios from 'axios'

const initialState = {
  transactions: [],
  isLoadingTransactions: true,
  error: '',
}

const urlApi = '/api/transactions/'

export const getTransactions = createAsyncThunk(
  'transactions/getTransactions',
  async () => {
    try {
      const { data } = await axios.get(urlApi, {
        user: '63aab4fc2493239835c9aa41',
      })
      console.log('data', data.data)
      return data.data
    } catch (error) {
      console.log('Something went wrong')
      console.log(error)
    }
  }
)

// TODO: getTransactions does not update the state

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  extraReducers: {
    [getTransactions.pending]: (state, action) => {
      state.isLoadingTransactions = true
    },
    [getTransactions.fulfilled]: (state, action) => {
      state.isLoadingTransactions = false
      state.transactions = action.payload
    },
    [getTransactions.rejected]: (state, action) => {
      state.isLoadingTransactions = false
      state.error = action.payload.error
    },
  },
})

export default transactionSlice.reducer
