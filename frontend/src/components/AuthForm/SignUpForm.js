import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useNavigate } from 'react-router-dom'

import { signup } from '../../store/user/userSlice'

// formik goes here:
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'

const SignUpForm = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [error, setError] = useState(false)

  const ValidationSchema = Yup.object().shape({
    username: Yup.string()
      .min(8, 'username must be at least 8 characters long')
      .max(20, 'username must be less than 20 characters long')
      .required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string()
      .min(8, 'password must be at least 8 characters long')
      .max(50, 'password must be less than 50 characters long')
      .required('Required'),
    confirmPassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('password'), null], 'Confirm Password does not match'),
  })

  const messageData = useSelector((state) => state.message)
  const { message } = messageData

  const submitForm = ({ username, email, password }) => {
    dispatch(signup({ username, email, password }))
      .unwrap()
      .then(() => {
        setTimeout(() => window.location.reload(), 1500)
        navigate('/login')
      })
      .catch(() => {
        setError(true)
        console.log('error')
      })
  }

  return (
    <div>
      <h1>Sign Up</h1>
      <span>Are you a new user? Welcome!</span>
      <Formik
        initialValues={{
          email: '',
          password: '',
          confirmPassword: '',
          username: '',
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
                <Field
                  type='text'
                  name='username'
                  placeholder='your username'
                />
                <ErrorMessage name='username' component='div' />
              </>

              <Field type='email' name='email' placeholder='your email' />
              <ErrorMessage name='email' component='div' />
              <Field
                type='password'
                name='password'
                placeholder='your password'
              />
              <ErrorMessage name='password' component='div' />
              <Field
                type='password'
                name='confirmPassword'
                placeholder='confirm your password'
              />
              <ErrorMessage name='confirmPassword' component='div' />
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

      <div className='d-flex flex-column'>
        {message ? (
          <div className={error ? 'alert alert-danger' : 'alert alert-success'}>
            <span>{message}</span>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default SignUpForm
