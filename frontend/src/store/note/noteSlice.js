import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  notes: [],
  isLoadingNotes: true,
}

const urlApi = '/api/notes/'

// a slice reducer
export const getNotes = createAsyncThunk('notes/getNotes', async (userId) => {
  try {
    const { data } = await axios.get(`/api/notes/${userId}`)

    return data.data
  } catch (error) {
    console.log('Something went wrong')
    console.log(error)
  }
})

export const addNote = createAsyncThunk('notes/addNote', async (note) => {
  try {
    const response = await axios.post('/api/notes/create-note', note)
    console.log('data', response.data)
    return response.data
  } catch (error) {
    console.log('Something went wrong while creating note')
    console.log(error)
  }
})

export const deleteNote = createAsyncThunk('notes/deleteNote', async (note) => {
  try {
    const response = await axios.delete(`/api/notes/delete-note/${note}`)
    console.log('data', response.data)
    return response.data
  } catch (error) {
    console.log('Something went wrong while deleting note.')
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
      state.isLoadingNotes = false
      state.notes = action.payload
    },
    [getNotes.rejected]: (state, action) => {
      state.isLoadingNotes = false
    },
    [addNote.pending]: (state, action) => {
      state.isLoadingNotes = true
    },
    [addNote.fulfilled]: (state, action) => {
      state.isLoadingNotes = false
      state.notes = [...state.notes, action.payload]
    },
    [addNote.rejected]: (state, action) => {
      state.isLoadingNotes = false
    },
  },
})

export default notesSlice.reducer
