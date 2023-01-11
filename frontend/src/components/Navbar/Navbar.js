import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Stack, Container, n } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import { ThemeProvider } from 'styled-components'
import { lightTheme, darkTheme, GlobalStyles } from '../../themes'

// i18n:
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../Layout/LanguageSwitcher/LanguageSwitcher'

// logout
import { logout } from '../../store/user/userSlice'

const MyNavbar = () => {
  const dispatch = useDispatch()

  // checking user
  const { user: user } = useSelector((state) => state.user)

  // dark mode here:
  const [theme, setTheme] = useState('light')
  const themeToggler = () => {
    if (theme === 'light') {
      setTheme('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      setTheme('light')
      localStorage.setItem('theme', 'light')
    }
  }

  // i18n:
  const { t } = useTranslation()

  // logout
  const logOut = (e) => {
    e.preventDefault()
    dispatch(logout())
      .unwrap()
      .then(() => {
        // TODO: modal here
        setTimeout(() => window.location.reload(), 1000)
      })
      .catch(() => {
        console.log('error')
      })
  }

  useEffect(() => {
    // theme
    const theme = localStorage.getItem('theme')
    setTheme(theme)
  }, [])

  return <div></div>
}

export default MyNavbar

{
  /* {user ? (
                  <>
                    <Link to={`/transactions/${user._id}`}>
                      <button
                        className='header__links-btn'
                        variant='outline-primary'
                      >
                        transactions
                      </button>
                    </Link>
                    <Link to={`/notes/${user._id}`}>
                      <button
                        className='header__links-btn'
                        variant='outline-primary'
                      >
                        notes
                      </button>
                    </Link>
                    <div className='d-flex align-items-center'>
                      <span>{username}</span>
                      <button
                        className='header__links-btn'
                        variant='outline-primary'
                        onClick={logOut}
                      >
                        logout
                      </button>
                    </div>
                  </>
                ) : (
                  <div>
                    <Link to='/login'>
                      <button
                        className='header__links-btn'
                        variant='outline-primary'
                      >
                        login
                      </button>
                    </Link>
                    <Link to='/signup'>
                      <button
                        className='header__links-btn'
                        variant='outline-primary'
                      >
                        signup
                      </button>
                    </Link>
                  </div>
                )} */
}
