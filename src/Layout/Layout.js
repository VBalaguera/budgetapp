import React from 'react'
import { useState } from 'react'
import AddBudgetModal from '../components/AddBudgetmodal/AddBudgetModal'
import AddExpenseModal from '../components/AddExpenseModal/AddExpenseModal'
// i18n:
import { useTranslation } from 'react-i18next'
import ViewExpensesModal from '../components/ViewExpensesModal/ViewExpensesModal'
import { Stack } from 'react-bootstrap'
import Container from 'react-bootstrap/Container'
import { Link } from 'react-router-dom'
/* import Lessons from "./components/Lessons/Lessons"; */

import Footer from '../components/Footer/Footer'
import LanguageSwitcher from '../components/Layout/LanguageSwitcher/LanguageSwitcher'
// NOTES UPGRADE:
import AddNoteModal from '../components/AddNoteModal/AddNoteModal'
const Layout = ({ children }) => {
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
      <Container className='my-4'>
        <Stack direction='horizontal' gap='2' className='mb-4'>
          <div className='header'>
            <div className='header__title'>
              <h1 className='me-auto'>
                <Link href='/'>Carrington</Link>
              </h1>
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
    </>
  )
}

export default Layout
