import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

import { getAuthHeader } from '../../utils/tools.js'

axios.defaults.headers.post['Content-Type'] = 'application/json'

const initialState = {
  dayPosts: [],
  isLoadingDayPosts: true,
}

const urlApi = '/api/notes/'

// a slice reducer
export const getDayPosts = () => {
  return async () => {
    try {
      const { data } = await axios.get(`/api/day_posts/read`, getAuthHeader())
      console.log('data', data)

      return data
    } catch (error) {
      console.log('Something went wrong')
      console.log(error)
    }
  }
}

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
      console.log(action)
      state.isLoadingDayPosts = false
    },
  },
})

export default dayPostSlice.reducer
