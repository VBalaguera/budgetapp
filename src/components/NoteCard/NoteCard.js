import React from 'react'
import { Card, Button } from 'react-bootstrap'
import './NoteCard.css'
import { useNotes } from '../../context/NotesContext'

//formatting

import { useTranslation } from 'react-i18next'

export default function NoteCard({ title, description, id }) {
  const { t } = useTranslation()
  const { notes, deleteNote } = useNotes()
  console.log(id)

  return (
    <Card>
      <Card.Title className='title'>
        <div className='notecard__info'>
          <div className='notecard__info__title-amount'>
            <div>
              <span className='budget__name'>{title}</span>
            </div>
          </div>
        </div>
      </Card.Title>
      <Card.Body>{description}</Card.Body>
      <Button
        className='top__expenses-button'
        onClick={() => {
          deleteNote(id)
        }}
        variant='outline-danger'
      >
        {t('buttons.delete')}
      </Button>
    </Card>
  )
}
