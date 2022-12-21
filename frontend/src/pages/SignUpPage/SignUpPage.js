import { useState, useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { useNavigate } from 'react-router-dom'

import Layout from '../../components/Layout/Layout'

import { signup } from '../../features/user/userSlice'

import { clearMessage } from '../../features/message/messageSlice'

const SignUpPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState(false)

  const userData = useSelector((state) => state.user)
  const { user } = userData
  const messageData = useSelector((state) => state.message)
  const { message } = messageData
  const registerForm = (e) => {
    e.preventDefault()
    console.log(name, username, password)
    dispatch(signup({ name, username, password }))
      .unwrap()
      .then(() => {
        setTimeout(() => navigate('/login'), 2000)
      })
      .catch(() => {
        setError(true)
        console.log('error')
      })
  }

  useEffect(() => {
    dispatch(clearMessage())
    if (user) {
      navigate('/')
    }
  }, [user, navigate, dispatch])

  return (
    <Layout>
      <h1>register or login</h1>

      <form onSubmit={registerForm}>
        <div>
          {' '}
          <label>username</label>
          <input
            value={name}
            placeholder='your username'
            required={true}
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>
        <div>
          {' '}
          <label>email</label>
          <input
            value={username}
            placeholder='your email'
            required={true}
            onChange={(e) => setUsername(e.target.value)}
          ></input>
        </div>
        <div>
          {' '}
          <label>password</label>
          <input
            value={password}
            placeholder='your password'
            required={true}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        <div className='d-flex flex-column'>
          {message ? (
            <div
              className={error ? 'alert alert-danger' : 'alert alert-success'}
            >
              <span>{message}</span>
            </div>
          ) : null}
        </div>
        <button type='submit'>login</button>
      </form>
    </Layout>
  )
}

export default SignUpPage
