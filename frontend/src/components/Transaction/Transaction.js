import moment from 'moment'
import { useDispatch } from 'react-redux'

import { Card } from 'react-bootstrap'

import { currencyFormatter } from '../../utils/tools'

import { deleteTransaction } from '../../store/transaction/transactionSlice'

const Transaction = ({ transaction }) => {
  console.log(transaction)
  const dispatch = useDispatch()
  const handleDeletion = (id) => {
    dispatch(deleteTransaction(id))
  }
  const color = transaction.amount < 0 ? 'bg-danger' : 'bg-success'
  return (
    <Card className='my-2 border-0'>
      <Card.Body className={color}>
        <Card.Title>
          <span>{transaction.text}</span>
        </Card.Title>

        <div className='d-flex flex-column'>
          <span>{moment(transaction.createdAt).format('DD/MM/YYYY')}</span>

          <span>{currencyFormatter.format(transaction.amount)}</span>
        </div>
      </Card.Body>
    </Card>
  )
}

export default Transaction
