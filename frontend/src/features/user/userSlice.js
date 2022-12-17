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
