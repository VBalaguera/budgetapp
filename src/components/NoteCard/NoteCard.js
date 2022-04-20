import React from 'react'
import { Card, Button } from 'react-bootstrap'
import moment from 'moment'
import './NoteCard.css'
import { useNotes } from '../../context/NotesContext'

//formatting

import { useTranslation } from 'react-i18next'

export default function NoteCard({ title, description, id, date, content }) {
  const { t } = useTranslation()
  const { deleteNote } = useNotes()

  return (
    <Card className='bg-secondary bg-opacity-25'>
      <Card.Body>
        <Card.Title className='title'>
          <div className='notecard__info'>
            <div className='notecard__info__title-amount'>
              <div>
                <span className='title'>{title}</span>
              </div>
              <div className='notecard__amounts'>
                {moment(date).format('DD/MM/YYYY')}
              </div>
            </div>
            <div className='description'>
              <span>{description}</span>
            </div>
            <div className='content'>
              <span>{content}</span>
            </div>
          </div>
        </Card.Title>

        <div>
          <Button
            className='top__expenses-button'
            onClick={() => {
              deleteNote(id)
            }}
            variant='outline-danger'
          >
            {t('buttons.delete')}
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}
