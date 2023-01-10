import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import {
  getTransactions,
  addTransaction,
  deleteTransaction,
} from '../store/transaction/transactionSlice'

import { Card, ProgressBar, Stack, Button } from 'react-bootstrap'

import { Formik, Field, Form, ErrorMessage, useField } from 'formik'
import * as Yup from 'yup'

import { currencyFormatter } from '../utils/tools'

import Layout from '../components/Layout/Layout'
import Transaction from '../components/Transaction/Transaction'
import Categories from '../components/Categories/Categories'

// picking dates
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

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
    category: Yup.string()
      .min(3, 'categories must be at least 3 characters long')
      .max(75, 'categories must be less than 75 characters long')
      .required('Required'),

    amount: Yup.number().default(0).required('Required'),
    date: Yup.string().required('Required'),
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
  // categories:
  const allCategories = [
    'all',
    ...new Set(transactions.map((transaction) => transaction.category)),
  ]
  const [categories, setCategories] = useState(allCategories)
  const [newTransactions, setNewTransactions] = useState(transactions)

  useEffect(() => {
    dispatch(getTransactions(params.id))
    setCategories(allCategories)
    setNewTransactions(transactions)
    filterItems()
  }, [dispatch])

  // income/expenses calcs

  const amounts = newTransactions.map((transaction) => transaction.amount)

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

  // picking date stuff

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

  const filterItems = (category) => {
    if (category === 'all') {
      setNewTransactions(transactions)
      return
    }
    /* iterating over og list */
    const newItems = transactions.filter(
      (transactions) => transactions.category === category
    )
    setNewTransactions(newItems)
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
              <div className='d-flex flex-column w-50'>
                <>
                  <Field type='text' name='text' placeholder='transaction' />
                  <ErrorMessage name='text' component='div' />
                </>
                <>
                  <Field type='text' name='category' placeholder='category' />
                  <ErrorMessage name='category' component='div' />
                </>

                <Field type='number' name='amount' placeholder='amount' />
                <ErrorMessage name='amount' component='div' />
                <MyDatePicker name='date' />
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

        <h2>transactions</h2>
        <div>
          <Categories filterItems={filterItems} allCategories={allCategories} />
        </div>
        {isLoadingTransactions && newTransactions !== null ? (
          <span>loading</span>
        ) : (
          newTransactions.map((transaction) => (
            <>
              <Transaction key={transaction._id} transaction={transaction} />
            </>
          ))
        )}
      </div>

      {income > 0 ? (
        <div className='bg-success my-2 p-3 d-flex align-items-center justify-content-between'>
          <h2>income</h2>
          <span className='fs-3'>{currencyFormatter.format(income)}</span>
        </div>
      ) : null}
      {expense > 0 ? (
        <div className='bg-danger my-2 p-3 d-flex align-items-center justify-content-between'>
          <h2>expenses</h2>

          <span className='fs-3'>{currencyFormatter.format(expense)}</span>
        </div>
      ) : null}
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
