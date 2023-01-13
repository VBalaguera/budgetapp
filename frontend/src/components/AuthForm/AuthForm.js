import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'

import { login } from '../../store/user/userSlice'

// formik goes here:
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'

const AuthForm = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [error, setError] = useState(false)

  const ValidationSchema = Yup.object().shape({
    password: Yup.string()
      .min(7, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
  })

  const messageData = useSelector((state) => state.message)
  const { message } = messageData

  const submitForm = ({ email, password }) => {
    dispatch(login({ email, password }))
      .unwrap()
      .then(() => {
        // setTimeout(() => window.location.reload())
        // navigate('/')
      })
      .catch(() => {
        console.log('error')
      })
  }

  return (
    <div>
      <h1>Login</h1>
      <span>You're required to login to proceed.</span>
      <Formik
        initialValues={{ email: '', password: '' }}
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
              <Field
                type='email'
                name='email'
                placeholder='your email'
                className='mt-2'
              />
              <ErrorMessage name='email' component='div' className='mb-1' />
              <Field
                type='password'
                name='password'
                placeholder='your password'
                className='my-2'
              />
              <ErrorMessage name='password' component='div' className='mb-1' />
            </div>

            <div className='flex flex-col items-start'>
              <Button
                className='btn btn-dark'
                type='submit'
                disabled={isSubmitting}
              >
                Login
              </Button>
            </div>
          </Form>
        )}
      </Formik>

      <div className='d-flex flex-column my-2'>
        {message ? (
          <div className={error ? 'alert alert-danger' : 'alert alert-success'}>
            <span>{message}</span>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default AuthForm
