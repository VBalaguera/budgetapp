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
import { Doughnut } from 'react-chartjs-2'
import { faSortNumericUpAlt } from '@fortawesome/free-solid-svg-icons'

// chart.js

function TransactionsPage() {
  const params = useParams()
  const dispatch = useDispatch()

  const [error, setError] = useState(false)
  const [max, setMax] = useState('')

  const ValidationSchema = Yup.object().shape({
    text: Yup.string()
      .min(3, 'text must be at least 3 characters long')
      .max(75, 'text must be less than 75 characters long')
      .required('Text is required'),
    category: Yup.string()
      .min(3, 'categories must be at least 3 characters long')
      .max(75, 'categories must be less than 75 characters long')
      .required('A category is required'),

    amount: Yup.number().default(0).required('An amount is required'),
    date: Yup.string().required('A date is required'),
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

  const categoryAmounts = newTransactions.map(
    (transaction) => transaction.amount
  )

  const categoryTotal = categoryAmounts
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2)

  // budget percentage

  function getProgressBarVariant(total, max) {
    const ratio = total / max
    console.log('ratio', ratio)
    console.log(parseFloat(ratio))
    if (ratio < 0.5) return 'primary'
    if (ratio < 0.75) return 'warning'
    if (ratio < 0.95) return 'danger'
    if (parseFloat(ratio) > -0.01) return 'primary'
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

  // chart.js data
  const data = {
    // FIXME:
    labels: newTransactions.map((transaction) => transaction.text),
    datasets: [
      {
        label: newTransactions.map((transaction) => transaction.text),
        data: newTransactions.map((transaction) => transaction.amount),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
    budgetLabels: newTransactions.map((budget) => budget),
  }

  const color =
    categoryTotal < 0
      ? 'me-3 fw-bold fs-3 text-danger'
      : 'me-3 fw-bold fs-3 text-success'

  useEffect(() => {
    dispatch(getTransactions(params.id))
  }, [dispatch])

  return (
    <Layout>
      <div>
        <h1>Expense Tracker</h1>
        {/* balance + income + expenses */}
        <div className='w-100 d-flex flex-column justify-content-center align-items-center'>
          <span>CURRENT BALANCE</span>
          <span className='fs-2 fw-bold'>{total} €</span>
        </div>
        <div className='d-flex'>
          {income > 0 ? (
            <div className='w-50 bg-light my-2 p-3 d-flex align-items-center justify-content-between'>
              <span className='text-dark'>INCOME</span>
              <span className='fs-2 fw-bold text-success'>
                {currencyFormatter.format(income)}
              </span>
            </div>
          ) : (
            <div className='w-50 bg-light my-2 p-3 d-flex align-items-center justify-content-center'>
              <span className='text-danger '>You have no income yet</span>
            </div>
          )}

          {expense > 0 ? (
            <div className='w-50 bg-light my-2 p-3 d-flex align-items-center justify-content-between'>
              <span className='text-dark'>EXPENSES</span>

              <span className='fs-2 fw-bold text-danger'>
                {currencyFormatter.format(expense)}
              </span>
            </div>
          ) : (
            <div className='w-50 bg-light my-2 p-3 d-flex align-items-center justify-content-center'>
              <span className='text-danger '>You have no expenses yet</span>
            </div>
          )}
        </div>

        <h2>History</h2>
        <div>
          <Categories filterItems={filterItems} allCategories={allCategories} />
        </div>
        <div className='my-2'>
          {isLoadingTransactions && newTransactions !== null ? (
            <span>loading</span>
          ) : (
            <div>
              {newTransactions.map((transaction) => (
                <>
                  <Transaction
                    key={transaction._id}
                    transaction={transaction}
                  />
                </>
              ))}
              {/* chart.js to represent this categoryAmounts */}
              {/* TODO: insert <span>Reviewing {currentCategory}</span> */}

              {newTransactions.length > 0 ? (
                <>
                  <Doughnut data={data} />{' '}
                  <div className='w-100 bg-light my-2 p-3 d-flex align-items-center justify-content-between'>
                    <span className='text-dark'>TOTAL</span>
                    <span className={color}>
                      {currencyFormatter.format(categoryTotal)}
                    </span>
                  </div>{' '}
                </>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* TODO: move this to a separate component */}
      <div>
        <h2>Add new transaction</h2>
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
              <div className='d-flex flex-column w-100'>
                <>
                  <Field
                    type='text'
                    name='text'
                    placeholder='transaction'
                    className='mt-2'
                  />
                  <ErrorMessage name='text' component='div' className='mb-1' />
                </>
                <>
                  <Field
                    type='text'
                    name='category'
                    placeholder='category'
                    className='mt-2'
                  />
                  <ErrorMessage
                    name='category'
                    component='div'
                    className='mb-1'
                  />
                </>

                <>
                  <Field
                    type='number'
                    name='amount'
                    placeholder='amount'
                    className='my-2'
                  />
                  <ErrorMessage
                    name='amount'
                    component='div'
                    className='mb-1'
                  />
                </>
                <MyDatePicker name='date' />
              </div>

              <div className='flex flex-col items-start'>
                <button
                  className='btn btn-dark'
                  type='submit'
                  disabled={isSubmitting}
                >
                  Create Transaction
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {/* <div>
        <h2>total</h2>
        <div className='d-flex flex-column'>
          <input
            placeholder='select max amount'
            type='text'
            name='max'
            onChange={(e) => setMax(e.target.value)}
          />
          <span>
            {total} €/ {max} €
          </span>
        </div>
        <ProgressBar
          variant={getProgressBarVariant(total, max)}
          min={0}
          max={max}
          now={total}
        ></ProgressBar>
      </div> */}
    </Layout>
  )
}

export default TransactionsPage
