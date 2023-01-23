import React, { useContext } from 'react'
import { v4 as uuidV4 } from 'uuid'
import useLocalStorage from '../hooks/useLocalStorage'

const BudgetsContext = React.createContext()

export const UNCATEGORIZED_BUDGET_ID = 'uncategorized'
export const UNCATEGORIZED_NOTE_ID = 'deleted'

export const useBudgets = () => {
  return useContext(BudgetsContext)
}

export const BudgetsProvider = ({ children }) => {
  const [budgets, setBudgets] = useLocalStorage('budgets', [])
  const [expenses, setExpenses] = useLocalStorage('expenses', [])

  function getBudgetExpenses(budgetId) {
    return expenses.filter((expense) => expense.budgetId === budgetId)
  }

  function addExpense({ description, amount, budgetId, notes }) {
    setExpenses((prevExpenses) => {
      if (
        prevExpenses.find((expenses) => expenses.description === description)
      ) {
        return prevExpenses
      }
      return [
        ...prevExpenses,
        { id: uuidV4(), description, amount, budgetId, notes },
      ]
    })
  }

  function addBudget({ name, description, max }) {
    setBudgets((prevBudgets) => {
      if (prevBudgets.find((budget) => budget.name === name)) {
        return prevBudgets
      }
      return [...prevBudgets, { id: uuidV4(), name, description, max }]
    })
  }

  function deleteBudget({ id }) {
    setExpenses((prevExpenses) => {
      return prevExpenses.map((expense) => {
        if (expense.budgetId !== id) return expense
        return { ...expense, budgetId: UNCATEGORIZED_BUDGET_ID }
      })
    })
    setBudgets((prevBudgets) => {
      return prevBudgets.filter((budget) => budget.id !== id)
    })
  }

  function deleteExpense({ id }) {
    setExpenses((prevExpenses) => {
      return prevExpenses.filter((expense) => expense.id !== id)
    })
  }

  const [notes, setNotes] = useLocalStorage('notes', [])

  // FIXME: add dates
  function addNote({ title, description }) {
    setNotes((prevNotes) => {
      if (prevNotes.find((note) => note.title === title)) {
        return prevNotes
      }
      return [...prevNotes, { id: uuidV4(), title, description }]
    })
  }

  function deleteNote({ id }) {
    setNotes((prevNotes) => {
      return prevNotes.filter((note) => note.id !== id)
    })
  }

  return (
    <BudgetsContext.Provider
      value={{
        budgets,
        expenses,
        getBudgetExpenses,
        addExpense,
        addBudget,
        deleteBudget,
        deleteExpense,
        notes,
        addNote,
        deleteNote,
      }}
    >
      {children}
    </BudgetsContext.Provider>
  )
}
