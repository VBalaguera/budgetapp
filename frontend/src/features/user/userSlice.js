import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const existingUser = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null

const initialState = {
  user: existingUser,
  isLoadingUser: true,
}

const urlApi = '/api/users/login/'

export const userLogin = (email, password) =>
  createAsyncThunk('user/userLogin', async () => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }
      const { data } = await axios.post(
        urlApi,
        {
          username: email,
          password: password,
        },
        config
      )

      localStorage.setItem('userInfo', JSON.stringify(data))
    } catch (error) {
      console.log(error)
    }
  })

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
      state.user = action.payload
    },
    [userLogin.rejected]: (state, action) => {
      console.log(action)
      state.isLoadingUser = false
    },
  },
})

export default userSlice.reducer
