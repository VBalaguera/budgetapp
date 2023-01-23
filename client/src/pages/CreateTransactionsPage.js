import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import { addTransaction } from '../store/transaction/transactionSlice'

import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'

import { currencyFormatter } from '../utils/tools'

import Layout from '../components/Layout/Layout'
import Transaction from '../components/Transaction/Transaction'

function CreateTransactionsPage() {
  const params = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [error, setError] = useState(false)

  const { user } = useSelector((state) => state.user)

  const ValidationSchema = Yup.object().shape({
    text: Yup.string()
      .min(3, 'text must be at least 3 characters long')
      .max(75, 'text must be less than 75 characters long')
      .required('Required'),

    number: Yup.number().default(0).required('Required'),
  })

  const submitForm = (values) => {
    dispatch(addTransaction(values))
      .unwrap()
      .then(() => {
        console.log('done!')
        setTimeout(navigate(`/transactions/` + user._id), 1500)
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
                  Create Account
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Layout>
  )
}

export default CreateTransactionsPage
