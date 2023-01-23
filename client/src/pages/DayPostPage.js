import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'

import { Card } from 'react-bootstrap'

import { getDayPosts, addDayPost } from '../store/day_post/day_postSlice'

import { Formik, Field, Form, FieldArray, ErrorMessage } from 'formik'
import * as Yup from 'yup'

import Layout from '../components/Layout/Layout'
const DayPostPage = () => {
  const params = useParams()
  const dispatch = useDispatch()
  const [error, setError] = useState(false)
  const { dayPosts, isLoadingPosts } = useSelector((state) => state.dayPosts)

  const ValidationSchema = Yup.object().shape({
    text: Yup.string()
      .min(3, 'text must be at least 3 characters long')
      .max(75, 'text must be less than 75 characters long')
      .required('Required'),

    amount: Yup.number().default(0).required('Required'),
  })

  const submitForm = (values) => {
    // dispatch(addDayPost(values))
    //   .unwrap()
    //   .then(window.location.reload())
    //   //   .then(() => {
    //   //     dispatch(getTransactions(params.id))
    //   //     console.log('done!')
    //   //     setTimeout(() => window.location.reload(), 1500)
    //   //   })
    //   .catch(() => {
    //     setError(true)
    //     console.log('error')
    //   })
    console.log(values)
  }

  useEffect(() => {
    dispatch(getDayPosts(params.id))
  }, [])

  console.log(dayPosts)

  return (
    <Layout>
      <h1>create day post</h1>
      <Formik
        initialValues={{
          user: params.id,
          content: { text: '', status: '' },
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
              <Field name='content.text' />
              <Field name='content.status' />
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
      <h1>day posts page</h1>
      {isLoadingPosts ? (
        <span>loading</span>
      ) : (
        dayPosts.map((day) => (
          <Card className='text-dark'>
            <Card.Body>
              <div className='d-flex flex-column'>
                {day.content.map((item) => (
                  <div className=''>
                    <span>{item.status}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
                <span>{day.date}</span>
              </div>
            </Card.Body>
          </Card>
        ))
      )}
    </Layout>
  )
}

export default DayPostPage
