import { useState } from 'react'
import { useDispatch } from 'react-redux'
import Modal from 'react-modal'

import { Button } from 'react-bootstrap'

import { deleteTransaction } from '../../store/transaction/transactionSlice'

const CustomModal = ({ _id }) => {
  const dispatch = useDispatch()
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
  const handleDeletion = (id) => {
    console.log(id)
    dispatch(deleteTransaction(id))
      .unwrap()
      .then(() => {
        console.log('done!')
        setTimeout(() => window.location.reload(), 1500)
      })
      .catch(() => {
        console.log('error')
      })
  }
  return (
    <>
      <Button variant='dark' className='favorites-btn' onClick={openModal}>
        Delete
      </Button>
      <Modal
        isOpen={modal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel='Warning'
      >
        <div className='d-flex flex-column align-items-center'>
          <span>Are you sure you want to delete this item?</span>
          <span className='text-danger'>This action cannot be undone.</span>
        </div>

        <div className='d-flex justify-content-between mt-2'>
          <Button
            variant='secondary'
            className='delete-btn'
            onClick={closeModal}
          >
            Cancel.
          </Button>
          <Button
            variant='danger'
            className='delete-btn'
            onClick={() => handleDeletion(_id)}
          >
            Delete.
          </Button>
        </div>
      </Modal>
    </>
  )
}

export default CustomModal
