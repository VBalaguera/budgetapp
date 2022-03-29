import { useState } from 'react'
import { Stack } from 'react-bootstrap'
import Container from 'react-bootstrap/Container'
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom'

import './App.css'
import AddBudgetModal from '../src/components/AddBudgetmodal/AddBudgetModal'
import AddExpenseModal from './components/AddExpenseModal/AddExpenseModal'

import ViewExpensesModal from './components/ViewExpensesModal/ViewExpensesModal'
import './styles/Buttons.css'
import './styles/Typography.css'
/* import Lessons from "./components/Lessons/Lessons"; */
import { ThemeProvider } from 'styled-components'
import { lightTheme, darkMode, GlobalStyles } from './themes'
import Footer from './components/Footer/Footer'

// NOTES UPGRADE:
import AddNoteModal from './components/AddNoteModal/AddNoteModal'

// i18n:
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './components/Layout/LanguageSwitcher/LanguageSwitcher'
import MainPage from './pages/MainPage'
import BudgetsPage from './pages/BudgetsPage'
import NotesPage from './pages/NotesPage'

function App() {
  // FIXME: add my styles
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false)
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false)
  const [viewExpensesModalBudgetId, setViewExpensesModalBudgetId] = useState()
  const [showAddExpenseModalBudgetId, setShowAddExpenseModalBudgetId] =
    useState()

  function openAddExpenseModal(budgetId) {
    setShowAddExpenseModal(true)
    setShowAddExpenseModalBudgetId(budgetId)
  }

  const [showAddNoteModal, setShowAddNoteModal] = useState(false)

  // dark mode here:
  const [theme, setTheme] = useState('light')

  const themeToggler = () => {
    theme === 'light' ? setTheme('dark') : setTheme('light')
  }

  // i18n:
  const { t } = useTranslation()

  return (
    <>
      <ThemeProvider theme={theme === 'light' ? lightTheme : darkMode}>
        <GlobalStyles />
        <Container className='my-4'>
          <Stack direction='horizontal' gap='2' className='mb-4'>
            <div className='header'>
              <div className='header__title'>
                <h1 className='me-auto'>Carrington</h1>
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
          <Router>
            <Routes>
              <Route path='/' exact element={<MainPage />} />
              <Route path='/budgets' element={<BudgetsPage />} />
              <Route path='/notes' element={<NotesPage />} />
            </Routes>
          </Router>
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

export default App
