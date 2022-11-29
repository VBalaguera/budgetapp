import { useState, useEffect } from 'react'
import { Stack } from 'react-bootstrap'
import Container from 'react-bootstrap/Container'
import Layout from './components/Layout/Layout'

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

// from budgets:
import { UNCATEGORIZED_BUDGET_ID, useBudgets } from './context/BudgetsContext'
import BudgetCard from './components/BudgetCard/BudgetCard'
import UncategorizedBudgetCard from './components/UncategorizedBudgetCard/UncategorizedBudgetCard'
import TotalBudgetCard from './components/TotalBudgetCard/TotalBudgetCard'

// from notes:
import { useNotes } from './context/NotesContext'
import NoteCard from './components/NoteCard/NoteCard.js'

// backend data
import axios from 'axios'

function App() {
  // from budgets:
  const { budgets, getBudgetExpenses } = useBudgets()

  // from notes:
  const { notes } = useNotes()

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

  // notes from backend
  let [backendNotes, setBackendNotes] = useState([])

  useEffect(() => {
    fetchNotes()
  }, [])

  let fetchNotes = async () => {
    const { data } = await axios.get('/api/notes/')
    setBackendNotes(data)
  }

  return (
    <>
      <Layout>
        <>
          {backendNotes.map((note, index) => (
            <li key={index}>{note.body}</li>
          ))}
        </>

        {/* budgets go here: */}
        <>
          <h3>{t('main.title')}</h3>
          {budgets && !budgets.length > 0 ? (
            <span>{t('main.nobudgets')}</span>
          ) : (
            <div className='main__grid'>
              {budgets.map((budget) => {
                const amount = getBudgetExpenses(budget.id).reduce(
                  (total, expense) => total + expense.amount,
                  0
                )
                return (
                  <BudgetCard
                    key={budget.key}
                    name={budget.name}
                    description={budget.description}
                    amount={amount}
                    max={budget.max}
                    onAddExpenseClick={() => openAddExpenseModal(budget.id)}
                    onViewExpenseClick={() =>
                      setViewExpensesModalBudgetId(budget.id)
                    }
                  />
                )
              })}
              <UncategorizedBudgetCard
                onAddExpenseClick={openAddExpenseModal}
                onViewExpenseClick={() =>
                  setViewExpensesModalBudgetId(UNCATEGORIZED_BUDGET_ID)
                }
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
            </div>
          )}

          <div className='secondary'>
            <TotalBudgetCard />
          </div>
        </>

        {/* notes go here */}
        <>
          <div className='notes__container'>
            <h3>{t('main.notes')}</h3>
            {notes && !notes.length > 0 ? (
              <span>{t('main.nonotes')}</span>
            ) : (
              notes.map((note) => (
                <NoteCard
                  key={note.id}
                  title={note.title}
                  id={note.id}
                  description={note.description}
                  content={note.content}
                  date={note.date}
                />
              ))
            )}
          </div>
        </>

        {/* miscelaneous info */}
        <div className='secondary'>
          <div className='card text-white bg-info w-100 bg-opacity-75'>
            <div className='card-header'>{t('faq.title')}</div>
            <div className='card-body'>
              <h5 className='card-title'>{t('faq.about')}</h5>
              <p className='card-text'>{t('faq.text')}</p>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default App
