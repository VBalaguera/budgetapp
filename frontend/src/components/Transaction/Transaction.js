import { useState } from 'react'
import moment from 'moment'
import { useDispatch } from 'react-redux'

import { Card, Button } from 'react-bootstrap'

import { currencyFormatter } from '../../utils/tools'

import { deleteTransaction } from '../../store/transaction/transactionSlice'

import CustomModal from '../CustomModal/CustomModal'
import Modal from 'react-modal'

const Transaction = ({ transaction }) => {
  const dispatch = useDispatch()
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
  const color = transaction.amount < 0 ? 'bg-danger' : 'bg-success'

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
    <Card className='my-2 border-0'>
      <Card.Body className={color}>
        <Card.Title className='d-flex justify-content-between'>
          <span className='fs-3'>{transaction.text}</span>
          <div>
            {/* deletion functionalities here:  */}

            {/* modal */}
            <Button
              variant='dark'
              className='favorites-btn'
              onClick={openModal}
            >
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
                  Cancel.
                </Button>
                <Button
                  variant='danger'
                  className='delete-btn'
                  onClick={() => handleDeletion(transaction._id)}
                >
                  Delete.
                </Button>
              </div>
            </Modal>
            {/*  */}
          </div>
        </Card.Title>

        <div className='d-flex justify-content-between'>
          <div className='d-flex flex-column'>
            <span>Date: {moment(transaction.date).format('MM/DD/YYYY')}</span>
            <span>
              Created at: {moment(transaction.createdAt).format('MM/DD/YYYY')}
            </span>

            <span className='fs-3'>
              {currencyFormatter.format(transaction.amount)}
            </span>
            <span>Category: {transaction.category}</span>
          </div>
        </div>
      </Card.Body>
    </Card>
  )
}

export default Transaction
