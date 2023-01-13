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
      return thunkAPI.rejectWithValue()
    }
  }
)

export const signup = createAsyncThunk(
  'user/userSignup',
  async ({ name, email, password }, thunkAPI) => {
    try {
      const response = await AuthService.signup(name, email, password)
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
