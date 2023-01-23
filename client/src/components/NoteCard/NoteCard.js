import { useState } from 'react'
import { Card, Button } from 'react-bootstrap'
import Modal from 'react-modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'

import { updateNote } from '../../store/note/noteSlice'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { updateNoteStatus } from '../../store/note/noteSlice'

// note update
// import { Formik, Field, Form, ErrorMessage, useField } from 'formik'
// import DatePicker from 'react-datepicker'
// import 'react-datepicker/dist/react-datepicker.css'
// import * as Yup from 'yup'

const NoteCard = ({ note, handleDeletion, handleUpdateStatus }) => {
  const params = useParams()
  const dispatch = useDispatch()
  // modal
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      color: 'black',

      transform: 'translate(-50%, -50%)',
    },
  }

  const [update, setUpdate] = useState(false)

  const [modal, setModal] = useState(false)

  const [error, setError] = useState(false)

  function openModal() {
    setModal(true)
  }

  function closeModal() {
    setModal(false)
  }

  // note update

  // updating notes

  // const MyDatePicker = ({ name = '' }) => {
  //   const [field, meta, helpers] = useField(name)

  //   const { value } = meta
  //   const { setValue } = helpers

  //   return (
  //     <DatePicker
  //       {...field}
  //       selected={value}
  //       onChange={(date) => setValue(date)}
  //     />
  //   )
  // }

  // const handleUpdate = (_id, body) => {
  //   dispatch(updateNote(note._id, body))
  //     .unwrap()
  //     .then(() => {
  //       // console.log('done!')
  //       // setTimeout(() => window.location.reload(), 1500)
  //     })
  //     .catch(() => {
  //       console.log('error')
  //     })
  // }

  // //  updating note's content
  // const submitForm = (_id, values) => {
  //   dispatch(updateNote(_id, values))
  //     .unwrap()
  //     .then()
  //     .then(() => {
  //       dispatch(getNotes(params.id))
  //       console.log('done!')
  //       // setTimeout(() => window.location.reload(), 1500)
  //     })
  //     .catch(() => {
  //       console.log('_id', _id)
  //       console.log('values', values)
  //       setError(true)
  //       console.log('error')
  //     })
  // }

  // // formik
  // const ValidationSchema = Yup.object().shape({
  //   text: Yup.string()
  //     .min(3, 'text must be at least 3 characters long')
  //     .max(75, 'text must be less than 75 characters long')
  //     .required('Required'),
  //   content: Yup.string().required('Required'),
  //   category: Yup.string()
  //     .min(3, 'categories must be at least 3 characters long')
  //     .max(75, 'categories must be less than 75 characters long')
  //     .required('Required'),
  //   // date: Yup.string().required('Required'),
  // })

  //
  return (
    <div className=' border-0'>
      <Card.Body
        className={`${
          note.reminder ? 'border-start border-4 border-dark' : ''
        } bg-light`}
      >
        <Card.Title className='d-flex justify-content-between'>
          <h3>{note.text}</h3>

          <div className='d-flex align-items-center'>
            <Button
              variant='primary'
              className='delete-btn me-2'
              onClick={() => handleUpdateStatus(note._id, !note.reminder)}
            >
              update status {note._id}
            </Button>

            {/* deletion functionalities here:  */}

            <FontAwesomeIcon
              size='sm'
              icon={faTrash}
              onClick={openModal}
              className='delete-btn'
            />
            <Modal
              isOpen={modal}
              onRequestClose={closeModal}
              style={customStyles}
              contentLabel='Warning'
            >
              <div className='d-flex flex-column align-items-center'>
                <span>Are you sure you want to delete this item?</span>
                <span className='text-danger'>
                  This action cannot be undone.
                </span>
              </div>

              <div className='d-flex justify-content-between mt-2'>
                <Button
                  variant='secondary'
                  className='delete-btn'
                  onClick={closeModal}
                >
                  Cancel
                </Button>
                <Button
                  variant='danger'
                  className='delete-btn'
                  onClick={() => handleDeletion(note._id)}
                >
                  Delete
                </Button>
              </div>
            </Modal>
            {/*  */}
          </div>
        </Card.Title>

        {/* note updating */}

        {/* <Formik
          initialValues={{
            text: note.text,
            category: note.category,
            content: note.content,
            date: '',
            reminder: note.reminder,
          }}
          validationSchema={ValidationSchema}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              submitForm(note._id, { values })
              console.log(note._id, values)
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

                <span>TODO: set reminder here</span>

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
                  Update Note
                </Button>
              </div>
            </Form>
          )}
        </Formik> */}

        {/*  */}

        <div className='d-flex justify-content-between'>
          <div className='d-flex flex-column'>
            <p>{note.content}</p>
            <span className='fst-italic'>{note.category}</span>
            <span>{moment(note.date).format('MM/DD/YYYY')}</span>
            {/* <span>
              Created at: {moment(note.createdAt).format('MM/DD/YYYY')}
            </span> */}
          </div>
        </div>
      </Card.Body>
    </div>
  )
}

export default NoteCard
