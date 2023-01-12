import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Card, Button } from 'react-bootstrap'
import Modal from 'react-modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { deleteNote } from '../../store/note/noteSlice'
import moment from 'moment'
const NoteCard = ({ note }) => {
  const dispatch = useDispatch()
  const handleDeletion = (id) => {
    console.log(id)
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
  const [modal, setModal] = useState(false)
  function openModal() {
    setModal(true)
  }

  function closeModal() {
    setModal(false)
  }
  return (
    <div className=' border-0'>
      <Card.Body className='border-start border-4 border-dark bg-light'>
        <Card.Title className='d-flex justify-content-between'>
          <span className='fs-3'>{note.text}</span>
          <div className='d-flex align-items-center'>
            {/* deletion functionalities here:  */}

            <FontAwesomeIcon
              size='md'
              icon={faTrash}
              onClick={openModal}
              className='cursor-pointer '
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

        <div className='d-flex justify-content-between'>
          <div className='d-flex flex-column'>
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
