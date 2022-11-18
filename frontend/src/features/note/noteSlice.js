import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  notes: [],
  isLoadingNotes: true,
}

const urlApi = '/api/notes/'

// a slice reducer
export const getNotes = createAsyncThunk('notes/getNotes', async () => {
  try {
    const { data } = await axios.get(urlApi)
    return data
  } catch (error) {
    console.log('Something went wrong')
    console.log(error)
  }
})

// the slice itself:

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  extraReducers: {
    // lifecycle actions here
    [getNotes.pending]: (state) => {
      state.isLoadingNotes = true
    },
    [getNotes.fulfilled]: (state, action) => {
      console.log(action)
      state.isLoadingNotes = false
      state.notes = action.payload
    },
    [getNotes.rejected]: (state, action) => {
      console.log(action)
      state.isLoadingNotes = false
    },
  },
})

export default notesSlice.reducer
