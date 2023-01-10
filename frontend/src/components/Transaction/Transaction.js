import { useState } from 'react'
import moment from 'moment'
import { useDispatch } from 'react-redux'

import { Card, Button } from 'react-bootstrap'

import { currencyFormatter } from '../../utils/tools'

import { deleteTransaction } from '../../store/transaction/transactionSlice'

const Transaction = ({ transaction }) => {
  const [error, setError] = useState(false)
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
        setError(true)
        console.log('error')
      })
  }
  const color = transaction.amount < 0 ? 'bg-danger' : 'bg-success'

  return (
    <Card className='my-2 border-0'>
      <Card.Body className={color}>
        <Card.Title>
          <span className='fs-3'>{transaction.text}</span>
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
          <div>
            <Button
              variant='dark'
              onClick={() => handleDeletion(transaction._id)}
            >
              delete
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  )
}

export default Transaction
