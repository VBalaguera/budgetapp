import axios from 'axios'

const API_URL = 'http://127.0.0.1:8000/api/users/'

const signup = (name, username, password) => {
  return axios.post(API_URL + 'register/', {
    name,
    email: username,
    username,
    password,
  })
}

const login = (username, password) => {
  return axios
    .post(API_URL + 'login/', {
      username,
      password,
    })
    .then((response) => {
      if (response.data.access) {
        localStorage.setItem('userInfo', JSON.stringify(response.data))
      }

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
