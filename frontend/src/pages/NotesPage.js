import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import {
  getNotes,
  addNote,
  deleteNote,
  updateNote,
  updateNoteStatus,
} from '../store/note/noteSlice'

import { Button } from 'react-bootstrap'

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

  // TODO: move this to a separate component?
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
    content: Yup.string().required('Required'),
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
  // updating notes
  const handleUpdateStatus = (_id, body) => {
    console.log(_id, body)
    dispatch(updateNoteStatus(_id, body))
      .unwrap()
      .then(() => {
        console.log('done!')
        // setTimeout(() => window.location.reload(), 1500)
      })
      .catch(() => {
        console.log('error')
      })
  }
  //

  // modal

  const { notes, isLoadingNotes } = useSelector((state) => state.notes)

  useEffect(() => {
    dispatch(getNotes(params.id))
  }, [dispatch, params.id])
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
              <NoteCard
                key={note._id}
                note={note}
                handleDeletion={handleDeletion}
                handleUpdateStatus={handleUpdateStatus}
              />
            ))
          ) : (
            // STANDARIZE THIS AND USE IT ELSEWHERE
            <span>you have no notes at this moment</span>
          )}
        </div>

        {/* note creation forms */}
        {/* create a separated comp for this */}
        {/* create a toggler for noteCreation comp */}
        <h2>create new note</h2>
        <Formik
          initialValues={{
            user: params.id,
            text: '',
            content: '',
            date: new Date(),
            reminder: false,
          }}
          validationSchema={ValidationSchema}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
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
                    placeholder='Your title'
                    className='mt-2'
                  />
                  <ErrorMessage name='text' component='div' className='mb-1' />
                </>
                <>
                  <Field
                    type='text'
                    name='category'
                    placeholder='Category'
                    className='my-2'
                  />
                  <ErrorMessage
                    name='category'
                    component='div'
                    className='mb-'
                  />
                </>

                <>
                  <>
                    <Field
                      type='text'
                      name='content'
                      placeholder='Your Content'
                      className='my-2'
                    />
                    <ErrorMessage
                      name='content'
                      component='div'
                      className='mb-'
                    />
                  </>
                </>

                <MyDatePicker name='date' />

                {/* set reminder here */}

                <div className='d-flex align-items-center my-2'>
                  <label className='me-2'>set a reminder?</label>
                  <Field
                    type='checkbox'
                    name='reminder'
                    placeholder='Set a reminder?'
                    className='my-2'
                  />
                </div>
              </div>

              <div className='flex flex-col items-start'>
                <Button
                  className='btn btn-dark'
                  type='submit'
                  disabled={isSubmitting}
                >
                  Create Note
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Layout>
  )
}

export default NotesPage
