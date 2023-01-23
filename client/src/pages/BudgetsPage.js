import React, { useState } from 'react'
import { UNCATEGORIZED_BUDGET_ID, useBudgets } from '../context/BudgetsContext'
import BudgetCard from '../components/BudgetCard/BudgetCard'
import UncategorizedBudgetCard from '../components/UncategorizedBudgetCard/UncategorizedBudgetCard'
import AddExpenseModal from '../components/AddExpenseModal/AddExpenseModal'
import TotalBudgetCard from '../components/TotalBudgetCard/TotalBudgetCard'
import ViewExpensesModal from '../components/ViewExpensesModal/ViewExpensesModal'
import { useTranslation } from 'react-i18next'
const BudgetsPage = () => {
  const { budgets, getBudgetExpenses } = useBudgets()
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false)
  const [viewExpensesModalBudgetId, setViewExpensesModalBudgetId] = useState()
  const [showAddExpenseModalBudgetId, setShowAddExpenseModalBudgetId] =
    useState()
  function openAddExpenseModal(budgetId) {
    setShowAddExpenseModal(true)
    setShowAddExpenseModalBudgetId(budgetId)
  }
  const { t } = useTranslation()
  return (
    <>
      <h3>{t('main.title')}</h3>
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
              onViewExpenseClick={() => setViewExpensesModalBudgetId(budget.id)}
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
      <div className='secondary'>
        <TotalBudgetCard />
      </div>
    </>
  )
}

export default BudgetsPage
