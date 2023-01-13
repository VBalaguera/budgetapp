import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

import { getAuthHeader } from '../../utils/tools.js'

axios.defaults.headers.post['Content-Type'] = 'application/json'

const initialState = {
  dayPosts: [],
  isLoadingDayPosts: true,
  error: '',
}

const urlApi = '/api/notes/'

// a slice reducer
export const getDayPosts = createAsyncThunk(
  'dayPosts/getDayPosts',
  async (id) => {
    try {
      const { data } = await axios.get(`/api/day_posts/read/${id}`)
      // , getAuthHeader()
      // console.log('data', data)

      return data
    } catch (error) {
      console.log('Something went wrong')
      console.log(error)
    }
  }
)

export const addDayPost = createAsyncThunk(
  'dayPosts/addDayPost',
  async (dayPost) => {
    try {
      const response = await axios.post(
        '/api/day_posts/create/add_day_post',
        dayPost
      )
      // console.log('data', response.data)

      return response.data
    } catch (error) {
      console.log('Something went wrong')
      console.log(error)
    }
  }
)

// the slice itself:

const dayPostSlice = createSlice({
  name: 'dayPosts',
  initialState,
  extraReducers: {
    // lifecycle actions here
    [getDayPosts.pending]: (state) => {
      state.isLoadingDayPosts = true
    },
    [getDayPosts.fulfilled]: (state, action) => {
      state.isLoadingDayPosts = false
      state.dayPosts = action.payload
    },
    [getDayPosts.rejected]: (state, action) => {
      state.isLoadingDayPosts = false
      state.error = action.payload.error
    },
  },
})

export default dayPostSlice.reducer
