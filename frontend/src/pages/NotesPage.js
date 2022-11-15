import React from 'react'

// NOTES UPGRADE:
import { useNotes } from '../context/NotesContext'

import NoteCard from '../components/NoteCard/NoteCard.js'
import { useTranslation } from 'react-i18next'

const NotesPage = () => {
  const { notes } = useNotes()
  // i18n:
  const { t } = useTranslation()
  return (
    <>
      <div className='notes__container'>
        <h3>{t('main.notes')}</h3>
        {notes.map((note) => (
          <NoteCard
            key={note.key}
            title={note.title}
            id={note.id}
            description={note.description}
            content={note.content}
            date={note.date}
          />
        ))}
      </div>
    </>
  )
}

export default NotesPage
