import axios from 'axios'

const API_URL = 'http://127.0.0.1:8000/api/users/'

const register = (username, email, password) => {
  return axios.post(API_URL + 'register/', {
    username,
    email,
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
  localStorage.removeItem('user')
}

const AuthService = {
  register,
  login,
  logout,
}

export default AuthService
