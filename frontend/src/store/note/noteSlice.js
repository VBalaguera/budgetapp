import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  notes: [],
  isLoadingNotes: true,
}

const urlApi = '/api/notes/'

// get
export const getNotes = createAsyncThunk('notes/getNotes', async (userId) => {
  try {
    const { data } = await axios.get(`/api/notes/${userId}`)

    return data.data
  } catch (error) {
    console.log('Something went wrong')
    console.log(error)
  }
})

// add
export const addNote = createAsyncThunk('notes/addNote', async (note) => {
  try {
    const response = await axios.post('/api/notes/create-note', note)

    return response.data
  } catch (error) {
    console.log('Something went wrong while creating note')
    console.log(error)
  }
})

// delete
export const deleteNote = createAsyncThunk('notes/deleteNote', async (note) => {
  try {
    const response = await axios.delete(`/api/notes/delete-note/${note}`)

    return response.data
  } catch (error) {
    console.log('Something went wrong while deleting note.')
    console.log(error)
  }
})

// update
export const updateNote = createAsyncThunk(
  'notes/updateNote',
  async (id, note) => {
    try {
      const response = await axios.patch(`/api/notes/update-note/${id}`, {
        note,
      })

      return response.data
    } catch (error) {
      console.log('Something went wrong while updating note.')
      console.log(error)
    }
  }
)
export const updateNoteStatus = createAsyncThunk(
  'notes/updateNoteStatus',
  async (id, note) => {
    console.log('id from updatenotestatus', id)
    console.log('note from updatenotestatus', note)
    try {
      const response = await axios.patch(
        `/api/notes/update-note-status/${id}`,
        {
          reminder: note,
        }
      )

      return response.data
    } catch (error) {
      console.log('Something went wrong while updating note.')
      console.log(error)
    }
  }
)

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
    [updateNote.pending]: (state, action) => {
      state.isLoadingNotes = true
    },
    [updateNote.fulfilled]: (state, action) => {
      state.isLoadingNotes = false
      state.notes = [...state.notes, action.payload]
    },
    [updateNote.rejected]: (state, action) => {
      state.isLoadingNotes = false
    },
  },
})

export default notesSlice.reducer
