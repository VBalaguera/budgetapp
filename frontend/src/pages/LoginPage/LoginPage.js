import React, { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import Layout from '../../components/Layout/Layout'

import { userLogin } from '../../features/user/userSlice'

const LoginPage = () => {
  const dispatch = useDispatch()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const userData = useSelector((state) => state.user)
  const { isLoadingUser, user, error } = userData

  const submitForm = (e) => {
    e.preventDefault()
    console.log(username, password)
    dispatch(userLogin({ username, password }))
  }

  return (
    <Layout>
      <div>LoginPage</div>

      <form onSubmit={submitForm}>
        <div>
          {' '}
          <label>email</label>
          <input
            value={username}
            placeholder='your email'
            onChange={(e) => setUsername(e.target.value)}
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
