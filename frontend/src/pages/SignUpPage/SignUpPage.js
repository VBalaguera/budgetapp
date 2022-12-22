import { useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { useNavigate } from 'react-router-dom'

import Layout from '../../components/Layout/Layout'

import SignUpForm from '../../components/AuthForm/SignUpForm'

import { clearMessage } from '../../features/message/messageSlice'

const SignUpPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const userData = useSelector((state) => state.user)
  const { user } = userData

  useEffect(() => {
    dispatch(clearMessage())
    if (user) {
      navigate('/')
    }
  }, [user, navigate, dispatch])

  return (
    <Layout>
      <SignUpForm />
    </Layout>
  )
}

export default SignUpPage
