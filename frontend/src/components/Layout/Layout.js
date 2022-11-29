import { useState, useEffect } from 'react'
import { Stack } from 'react-bootstrap'
import Container from 'react-bootstrap/Container'

import '../../App.css'
import AddBudgetModal from '../AddBudgetmodal/AddBudgetModal'
import AddExpenseModal from '../AddExpenseModal/AddExpenseModal'

import ViewExpensesModal from '../ViewExpensesModal/ViewExpensesModal'
import '../../styles/Buttons.css'
import '../../styles/Typography.css'
/* import Lessons from "./components/Lessons/Lessons"; */
import { ThemeProvider } from 'styled-components'
import { lightTheme, darkMode, GlobalStyles } from '../../themes'
import Footer from '../Footer/Footer'

// NOTES UPGRADE:
import AddNoteModal from '../AddNoteModal/AddNoteModal'

// i18n:
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../Layout/LanguageSwitcher/LanguageSwitcher'

// backend data
import axios from 'axios'

function Layout({ children }) {
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false)
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false)
  const [viewExpensesModalBudgetId, setViewExpensesModalBudgetId] = useState()
  const [showAddExpenseModalBudgetId, setShowAddExpenseModalBudgetId] =
    useState()

  const [showCookieBanner, setShowCookieBanner] = useState(true)

  function openAddExpenseModal(budgetId) {
    setShowAddExpenseModal(true)
    setShowAddExpenseModalBudgetId(budgetId)
  }

  const [showAddNoteModal, setShowAddNoteModal] = useState(false)

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

  // notes from backend
  let [backendNotes, setBackendNotes] = useState([])

  const hideCookieBanner = () => {
    localStorage.setItem('cookieBanner', 'false')
    setShowCookieBanner(false)
  }

  useEffect(() => {
    fetchNotes()

    // theme
    const theme = localStorage.getItem('theme')
    setTheme(theme)

    // checking if cookieBanner was shown
    const cookieBanner = localStorage.getItem('cookieBanner')
    console.log('cookieBanner', cookieBanner)
    if (cookieBanner !== null) {
      setShowCookieBanner(JSON.parse(cookieBanner))
    }
  }, [])

  let fetchNotes = async () => {
    const { data } = await axios.get('/api/notes/')
    setBackendNotes(data)
  }

  return (
    <>
      <ThemeProvider theme={theme === 'light' ? lightTheme : darkMode}>
        <GlobalStyles />
        <Container className='my-4'>
          {/* navbar */}
          <Stack direction='horizontal' gap='2' className='mb-4'>
            <div className='header'>
              <div className='header__title'>
                <div className='d-flex justify-content-start'>
                  <h1 className='carrington-c'>C</h1>
                  <h1>arrington</h1>
                </div>
              </div>
              <div className='header__links'>
                <button
                  className='header__links-btn'
                  onClick={() => themeToggler()}
                >
                  {theme === 'light' ? (
                    <>{t('main.dark')}</>
                  ) : (
                    <>{t('main.light')}</>
                  )}
                </button>
                <LanguageSwitcher />
                <button
                  className='header__links-btn'
                  variant='outline-primary'
                  onClick={() => setShowAddBudgetModal(true)}
                >
                  {t('buttons.addBudget')}
                </button>
                <button
                  className='header__links-btn'
                  variant='outline-primary'
                  onClick={() => setShowAddNoteModal(true)}
                >
                  {t('buttons.addNote')}
                </button>
                <button
                  className='header__links-btn'
                  variant='outline-primary'
                  onClick={openAddExpenseModal}
                >
                  {t('buttons.addExpense')}
                </button>
              </div>
            </div>
          </Stack>
          {/*  */}
          {showCookieBanner && (
            <div className='d-flex flex-column my-2'>
              <span>
                This site uses cookies only for functionality purposes.
              </span>
              <button
                className='btn btn-primary'
                onClick={() => hideCookieBanner()}
              >
                click here to hide banner
              </button>
            </div>
          )}
          <main>{children}</main>
        </Container>
        <AddBudgetModal
          show={showAddBudgetModal}
          handleClose={() => setShowAddBudgetModal(false)}
        />
        <AddNoteModal
          show={showAddNoteModal}
          handleClose={() => setShowAddNoteModal(false)}
        />
        <AddExpenseModal
          show={showAddExpenseModal}
          defaultBudgetId={showAddExpenseModalBudgetId}
          handleClose={() => setShowAddExpenseModal(false)}
        />
        <ViewExpensesModal
          budgetId={viewExpensesModalBudgetId}
          handleClose={() => setViewExpensesModalBudgetId()}
        />
        <Footer />
      </ThemeProvider>
    </>
  )
}

export default Layout
