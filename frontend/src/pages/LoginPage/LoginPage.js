import { useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'

import Layout from '../../components/Layout/Layout'

import AuthForm from '../../components/AuthForm/AuthForm'

import { clearMessage } from '../../store/message/messageSlice'

const LoginPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const userData = useSelector((state) => state.user)
  const { user } = userData

  useEffect(() => {
    dispatch(clearMessage())
    if (user !== null) {
      // navigate('/')
      console.log(user)
    }
  }, [user, navigate, dispatch])

  return (
    <Layout>
      {/* login form */}
      <AuthForm />

      {/* signup form */}
    </Layout>
  )
}

export default LoginPage
