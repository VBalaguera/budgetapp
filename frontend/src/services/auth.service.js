import axios from 'axios'

const API_URL = 'http://localhost:3001/api/users/'

const signup = (username, email, password) => {
  return axios.post(API_URL + 'register/', {
    email,
    username,
    password,
  })
}

const login = (email, password) => {
  return axios
    .post(API_URL + 'signin', {
      email,
      password,
    })
    .then((response) => {
      if (response.data.access) {
        localStorage.setItem('userInfo', JSON.stringify(response.data))
      }
      // TODO: revisit jwt security for backend

      localStorage.setItem('userInfo', JSON.stringify(response.data))
      return response.data
    })
}

const logout = () => {
  localStorage.removeItem('userInfo')
  console.log('goodbye')
}

const AuthService = {
  signup,
  login,
  logout,
}

export default AuthService
