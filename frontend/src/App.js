import { useState, useEffect } from 'react'
import Layout from './components/Layout/Layout'

import './App.css'
import AddExpenseModal from './components/AddExpenseModal/AddExpenseModal'

import ViewExpensesModal from './components/ViewExpensesModal/ViewExpensesModal'
import './styles/Buttons.css'
import './styles/Typography.css'

// i18n:
import { useTranslation } from 'react-i18next'

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
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false)
  const [viewExpensesModalBudgetId, setViewExpensesModalBudgetId] = useState()
  const [showAddExpenseModalBudgetId, setShowAddExpenseModalBudgetId] =
    useState()

  function openAddExpenseModal(budgetId) {
    setShowAddExpenseModal(true)
    setShowAddExpenseModalBudgetId(budgetId)
  }

  // i18n:
  const { t } = useTranslation()

  // // notes from backend
  // let [backendNotes, setBackendNotes] = useState([])

  // useEffect(() => {
  //   fetchNotes()
  // }, [])

  // let fetchNotes = async () => {
  //   const { data } = await axios.get('/api/notes/')
  //   setBackendNotes(data)
  // }

  return (
    <>
      <Layout>
        {/* <>
          {backendNotes.map((note, index) => (
            <li key={index}>{note.body}</li>
          ))}
        </> */}

        {/* budgets go here: */}

        {/* miscelaneous info */}
        <div className='secondary'>
          <div className='card  bg-light text-black w-100 bg-opacity-75'>
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
