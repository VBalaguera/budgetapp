import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { getNotes, addNote, deleteNote } from '../store/note/noteSlice'

import Layout from '../components/Layout/Layout'

// TODO: move this to a separate component for CREATING NOTES
// formik magic
import { Formik, Field, Form, ErrorMessage, useField } from 'formik'
import * as Yup from 'yup'

// picking dates
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import NoteCard from '../components/NoteCard/NoteCard'

const NotesPage = () => {
  const params = useParams()
  const dispatch = useDispatch()

  //
  // TODO: move this to a separate component for CREATING NOTES
  //

  const [error, setError] = useState(false)

  const MyDatePicker = ({ name = '' }) => {
    const [field, meta, helpers] = useField(name)

    const { value } = meta
    const { setValue } = helpers

    return (
      <DatePicker
        {...field}
        selected={value}
        onChange={(date) => setValue(date)}
      />
    )
  }

  // formik
  const ValidationSchema = Yup.object().shape({
    text: Yup.string()
      .min(3, 'text must be at least 3 characters long')
      .max(75, 'text must be less than 75 characters long')
      .required('Required'),
    category: Yup.string()
      .min(3, 'categories must be at least 3 characters long')
      .max(75, 'categories must be less than 75 characters long')
      .required('Required'),
    date: Yup.string().required('Required'),
  })

  const submitForm = (values) => {
    dispatch(addNote(values))
      .unwrap()
      .then(window.location.reload())
      //   .then(() => {
      //     dispatch(getTransactions(params.id))
      //     console.log('done!')
      //     setTimeout(() => window.location.reload(), 1500)
      //   })
      .catch(() => {
        setError(true)
        console.log('error')
      })
  }

  // deleting notes:

  const handleDeletion = (id) => {
    dispatch(deleteNote(id))
      .unwrap()
      .then(() => {
        console.log('done!')
        setTimeout(() => window.location.reload(), 1500)
      })
      .catch(() => {
        console.log('error')
      })
  }
  //
  //
  //
  //

  // modal

  const { notes, isLoadingNotes } = useSelector((state) => state.notes)

  useEffect(() => {
    dispatch(getNotes(params.id))
  }, [])
  return (
    <Layout>
      <div>
        <h1>Notes page</h1>

        <div>
          <h2>all notes</h2>
          {isLoadingNotes ? (
            <span>loading</span>
          ) : notes.length ? (
            notes.map((note) => (
              // TODO: move this to a separate component for NOTES
              <NoteCard key={note._id} note={note}></NoteCard>
            ))
          ) : (
            // STANDARIZE THIS AND USE IT ELSEWHERE
            <span>you have no notes at this moment</span>
          )}
        </div>

        {/* note creation forms */}
        <h2>create new note</h2>
        <Formik
          initialValues={{
            user: params.id,
            text: '',
            amount: '',
            date: new Date(),
          }}
          validationSchema={ValidationSchema}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              console.log(values)
              submitForm(values)
              setSubmitting(false)
            }, 500)
          }}
        >
          {({ values, isSubmitting }) => (
            <Form>
              <div className='d-flex flex-column w-100'>
                <>
                  <Field
                    type='text'
                    name='text'
                    placeholder='your text'
                    className='mt-2'
                  />
                  <ErrorMessage name='text' component='div' className='mb-1' />
                </>
                <>
                  <Field
                    type='text'
                    name='category'
                    placeholder='category'
                    className='my-2'
                  />
                  <ErrorMessage
                    name='category'
                    component='div'
                    className='mb-'
                  />
                </>

                <MyDatePicker name='date' />
              </div>

              <div className='flex flex-col items-start'>
                <button
                  className='btn btn-dark'
                  type='submit'
                  disabled={isSubmitting}
                >
                  Create Transaction
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Layout>
  )
}

export default NotesPage

// import React from 'react'

// // NOTES UPGRADE:
// import { useNotes } from '../context/NotesContext'

// import NoteCard from '../components/NoteCard/NoteCard.js'
// import { useTranslation } from 'react-i18next'

// const NotesPage = () => {
//   const { notes } = useNotes()
//   // i18n:
//   const { t } = useTranslation()
//   return (
//     <>
//       <div className='notes__container'>
//         <h3>{t('main.notes')}</h3>
//         {notes.map((note) => (
//           <NoteCard
//             key={note.key}
//             title={note.title}
//             id={note.id}
//             description={note.description}
//             content={note.content}
//             date={note.date}
//           />
//         ))}
//       </div>
//     </>
//   )
// }

// export default NotesPage
