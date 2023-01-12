import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Navbar, Nav, Button } from 'react-bootstrap'

import { Link } from 'react-router-dom'

import { ThemeProvider } from 'styled-components'
import { lightTheme, GlobalStyles, darkTheme } from '../../themes'

import Footer from '../Footer/Footer'

// i18n:
import { useTranslation } from 'react-i18next'

import { logout } from '../../store/user/userSlice'
import CookieBanner from '../CookieBanner/CookieBanner'

import i18n from '../../i18n'

function Layout({ children }) {
  const dispatch = useDispatch()

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

  useEffect(() => {
    // theme
    const theme = localStorage.getItem('theme')
    setTheme(theme)
  }, [])

  const { user: user } = useSelector((state) => state.user)
  // const username = user.email.split('@')[0]
  // console.log(username)

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

  return (
    <>
      <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
        <GlobalStyles />
        <Container className='my-4 min-vh-100'>
          {/* navbar */}
          <Navbar
            variant={theme === 'light' ? 'light' : 'dark'}
            expand='lg'
            className='justify-content-between'
          >
            <Navbar.Brand href='/'>
              <div className='d-flex justify-content-start'>
                <h1 className='carrington-c'>C</h1>
                <h1>arrington</h1>
              </div>
            </Navbar.Brand>

            <Navbar.Toggle aria-controls='basic-navbar-nav' />

            <Navbar.Collapse className='flex-grow-0' id='basic-navbar-nav'>
              <Nav className='ml-auto'>
                <div className='d-flex navbar-responsive'>
                  {user ? (
                    <>
                      <Nav.Link href={`/transactions/${user._id}`}>
                        <Button
                          variant={
                            theme === 'light' ? 'outline-dark' : 'outline-light'
                          }
                        >
                          transactions
                        </Button>
                      </Nav.Link>
                      <Nav.Link href={`/notes/${user._id}`}>
                        <Button
                          variant={
                            theme === 'light' ? 'outline-dark' : 'outline-light'
                          }
                        >
                          notes
                        </Button>
                      </Nav.Link>
                      <Nav.Link href={`/notes/${user._id}`}>
                        <Button
                          variant={
                            theme === 'light' ? 'outline-dark' : 'outline-light'
                          }
                        >
                          {user.email.split('@')[0]}
                        </Button>
                      </Nav.Link>

                      <Nav.Link>
                        <Button
                          variant={
                            theme === 'light' ? 'outline-dark' : 'outline-light'
                          }
                          onClick={logOut}
                        >
                          logout
                        </Button>
                      </Nav.Link>
                    </>
                  ) : (
                    <>
                      <Nav.Link href='/login'>
                        <Button
                          variant={
                            theme === 'light' ? 'outline-dark' : 'outline-light'
                          }
                        >
                          login
                        </Button>
                      </Nav.Link>
                      <Nav.Link href='/signup'>
                        <Button
                          variant={
                            theme === 'light' ? 'outline-dark' : 'outline-light'
                          }
                        >
                          signup
                        </Button>
                      </Nav.Link>
                    </>
                  )}

                  {/* language and theme settings */}
                  <Button
                    className='navbar-btn'
                    variant={
                      theme === 'light' ? 'outline-dark' : 'outline-light'
                    }
                    onClick={() => themeToggler()}
                  >
                    {theme === 'light' ? (
                      <>{t('main.dark')}</>
                    ) : (
                      <>{t('main.light')}</>
                    )}
                  </Button>

                  <div className='navbar-btn-language-switcher'>
                    {i18n.language === 'es' ? (
                      <Button
                        variant={
                          theme === 'light' ? 'outline-dark' : 'outline-light'
                        }
                        type='submit'
                        onClick={() => i18n.changeLanguage('en')}
                      >
                        en
                      </Button>
                    ) : (
                      <Button
                        variant={
                          theme === 'light' ? 'outline-dark' : 'outline-light'
                        }
                        type='submit'
                        onClick={() => i18n.changeLanguage('es')}
                      >
                        es
                      </Button>
                    )}
                  </div>
                </div>
              </Nav>
            </Navbar.Collapse>
          </Navbar>

          {/* navbar ends here */}

          <CookieBanner />

          <main>{children}</main>
        </Container>

        <Footer />
      </ThemeProvider>
    </>
  )
}

export default Layout
