import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  dayPosts: [],
  isLoadingNotes: true,
}

const urlApi = '/api/notes/'

// a slice reducer
export const getDayPosts = createAsyncThunk('notes/getNotes', async () => {
  try {
    const { data } = await axios.get(`/api/day_posts/read`)
    console.log('data', data)

    return data
  } catch (error) {
    console.log('Something went wrong')
    console.log(error)
  }
})

// the slice itself:

const dayPostSlice = createSlice({
  name: 'notes',
  initialState,
  extraReducers: {
    // lifecycle actions here
    [getDayPosts.pending]: (state) => {
      state.isLoadingDayPosts = true
    },
    [getDayPosts.fulfilled]: (state, action) => {
      console.log(action)
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
