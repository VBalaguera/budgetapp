import React, { useContext } from 'react'
import { v4 as uuidV4 } from 'uuid'
import useLocalStorage from '../hooks/useLocalStorage'

const NotesContext = React.createContext()

export const UNCATEGORIZED_NOTE_ID = 'deleted'
// deleting notes

export const useNotes = () => {
  return useContext(NotesContext)
}

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useLocalStorage('notes', [])

  // FIXME: add dates
  function addNote({ title, description, noteId }) {
    setNotes((prevNotes) => {
      if (prevNotes.find((note) => note.title === title)) {
        return prevNotes
      }
      return [...prevNotes, { id: uuidV4(), title, description, noteId }]
    })
  }

  function deleteNote({ id }) {
    setNotes((prevNotes) => {
      return prevNotes.map((note) => {
        if (note.id !== id) return note
        return { ...note }
      })
    })
  }

  return (
    <NotesContext.Provider
      value={{
        notes,
        addNote,
        deleteNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  )
}
