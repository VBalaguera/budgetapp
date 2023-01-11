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
  async (userId) => {
    try {
      const { data } = await axios.get(`/api/transactions/${userId}`)
      return data.data
    } catch (error) {
      console.log('Something went wrong')
      console.log(error)
    }
  }
)

export const addTransaction = createAsyncThunk(
  'transactions/addTransaction',
  async (transaction) => {
    try {
      const response = await axios.post(
        '/api/transactions/create-transaction',
        transaction
      )
      console.log('data', response.data)
      return response.data
    } catch (error) {
      console.log('Something went wrong')
      console.log(error)
    }
  }
)

export const deleteTransaction = createAsyncThunk(
  'transactions/deleteTransaction',
  async (transaction) => {
    try {
      const response = await axios.delete(
        `/api/transactions/delete-transaction/${transaction}`
      )
      console.log('data', response.data)
      return response.data
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
    // TODO: RETURN TO THIS AT SOME POINT,
    // THE IDEA IS TO STOP USING WINDOW.LOCATION.RELOAD() ON TRANSACTIONSPAGE.JS
    [addTransaction.pending]: (state, action) => {
      state.isLoadingTransactions = true
    },
    [addTransaction.fulfilled]: (state, action) => {
      state.isLoadingTransactions = false
      state.transactions = [...state.transactions, action.payload]
    },
    [addTransaction.rejected]: (state, action) => {
      state.isLoadingTransactions = false
    },
  },
})

export default transactionSlice.reducer
