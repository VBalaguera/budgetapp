import { useState } from 'react'
import moment from 'moment'
import { useDispatch } from 'react-redux'

import { Card, Button } from 'react-bootstrap'

import { currencyFormatter } from '../../utils/tools'

import { deleteTransaction } from '../../store/transaction/transactionSlice'

import Modal from 'react-modal'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

const Transaction = ({ transaction }) => {
  const dispatch = useDispatch()
  const handleDeletion = (id) => {
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
  const color =
    transaction.amount < 0
      ? 'me-3 fw-bold fs-3 text-danger'
      : 'me-3 fw-bold fs-3 text-success'

  const border =
    transaction.amount < 0
      ? 'border-start border-4 border-danger bg-light'
      : 'border-start border-4 border-success bg-light'

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

  //

  return (
    <div className='text-dark border-0'>
      <Card.Body className={border}>
        <Card.Title className='d-flex justify-content-between'>
          <span className='fs-3'>{transaction.text}</span>
          <div className='d-flex align-items-center'>
            {/* deletion functionalities here:  */}

            {/* modal */}
            <span className={color}>
              {currencyFormatter.format(transaction.amount)}
            </span>

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
                  onClick={() => handleDeletion(transaction._id)}
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
            <span className='fst-italic'>{transaction.category}</span>
            <span>{moment(transaction.date).format('MM/DD/YYYY')}</span>
            {/* <span>
              Created at: {moment(transaction.createdAt).format('MM/DD/YYYY')}
            </span> */}
          </div>
        </div>
      </Card.Body>
    </div>
  )
}

export default Transaction
