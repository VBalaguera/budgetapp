import React, { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import Layout from '../../components/Layout/Layout'

import { userLogin } from '../../features/user/userSlice'

const LoginPage = () => {
  const dispatch = useDispatch()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const userData = useSelector((state) => state.user)
  const { isLoadingUser, user, error } = userData

  useEffect(() => {
    if (user) {
      console.log(user)
    }
  }, [])

  const submitForm = (e) => {
    e.preventDefault()
    console.log(email, password)
    dispatch(userLogin(email, password))
  }

  return (
    <Layout>
      <div>LoginPage</div>
      <form onSubmit={submitForm}>
        <div>
          {' '}
          <label>email</label>
          <input
            value={email}
            placeholder='your email'
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
        <div>
          {' '}
          <label>password</label>
          <input
            value={password}
            placeholder='your password'
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        <button type='submit'>login</button>
      </form>
    </Layout>
  )
}

export default LoginPage
