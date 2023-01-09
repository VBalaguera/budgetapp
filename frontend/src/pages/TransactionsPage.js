import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import {
  getTransactions,
  addTransaction,
  deleteTransaction,
} from '../store/transaction/transactionSlice'

import { Card, ProgressBar, Stack, Button } from 'react-bootstrap'

import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'

import { currencyFormatter } from '../utils/tools'

import Layout from '../components/Layout/Layout'
import Transaction from '../components/Transaction/Transaction'

function TransactionsPage() {
  const params = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [error, setError] = useState(false)

  const ValidationSchema = Yup.object().shape({
    text: Yup.string()
      .min(3, 'text must be at least 3 characters long')
      .max(75, 'text must be less than 75 characters long')
      .required('Required'),

    amount: Yup.number().default(0).required('Required'),
  })

  const submitForm = (values) => {
    dispatch(addTransaction(values))
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

  const { transactions, isLoadingTransactions } = useSelector(
    (state) => state.transactions
  )

  // income/expenses calcs

  const amounts = transactions.map((transaction) => transaction.amount)

  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2)

  const expense = (
    amounts.filter((item) => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2)

  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2)

  // budget percentage

  const max = '1500'
  function getProgressBarVariant(amount, max) {
    const ratio = amount / max
    if (ratio < 0.5) return 'primary'
    if (ratio < 0.75) return 'warning'
    if (ratio < 0.95) return 'danger'
    return 'danger'
  }

  useEffect(() => {
    dispatch(getTransactions(params.id))
  }, [])

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

  return (
    <Layout>
      <div>
        <h2>insert new transaction</h2>
        <Formik
          initialValues={{
            user: params.id,
            text: '',
            amount: '',
          }}
          validationSchema={ValidationSchema}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              submitForm(values)
              setSubmitting(false)
            }, 400)
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className='d-flex flex-column w-50'>
                <>
                  <Field type='text' name='text' placeholder='your text' />
                  <ErrorMessage name='text' component='div' />
                </>

                <Field type='number' name='amount' placeholder='amount' />
                <ErrorMessage name='amount' component='div' />
              </div>

              <div className='flex flex-col items-start'>
                <button
                  className='btn btn-primary'
                  type='submit'
                  disabled={isSubmitting}
                >
                  Create Transaction
                </button>
              </div>
            </Form>
          )}
        </Formik>

        {/* {transactions ? transactions.map((transaction) => (
            <Transaction key={transaction._id} transaction={transaction} />
          : null} */}

        <h2>transactions</h2>
        {isLoadingTransactions && transactions !== null ? (
          <span>loading</span>
        ) : (
          transactions.map((transaction) => (
            <>
              <Transaction key={transaction._id} transaction={transaction} />
              <button onClick={() => handleDeletion(transaction._id)}>
                delete {transaction._id}
              </button>
            </>
          ))
        )}
      </div>
      <div className='bg-success my-2 p-3'>
        <h2>income</h2>
        <span>{currencyFormatter.format(income)}</span>
      </div>
      <div className='bg-danger my-2 p-3'>
        <h2>expenses</h2>

        <span>{currencyFormatter.format(expense)}</span>
      </div>
      <div>
        <h2>total</h2>
        <span>
          {total} €/ {max} €
        </span>

        <ProgressBar
          variant={getProgressBarVariant(total, max)}
          min={0}
          max={max}
          now={total}
        ></ProgressBar>
      </div>
    </Layout>
  )
}

export default TransactionsPage
