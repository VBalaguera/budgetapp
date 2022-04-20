import { Modal, Button, Stack, Card } from 'react-bootstrap'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import {
  UNCATEGORIZED_BUDGET_ID,
  useBudgets,
} from '../../context/BudgetsContext'
import { currencyFormatter } from '../../utils'
import './ViewExpensesModal.css'
import { useTranslation } from 'react-i18next'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function ViewExpensesModal({ budgetId, handleClose }) {
  const { getBudgetExpenses, budgets, deleteBudget, deleteExpense } =
    useBudgets()

  const expenses = getBudgetExpenses(budgetId)

  const budget =
    UNCATEGORIZED_BUDGET_ID === budgetId
      ? { name: 'uncategorized', id: UNCATEGORIZED_BUDGET_ID }
      : budgets.find((budget) => budget.id === budgetId)

  const data = {
    labels: expenses.map((expense) => expense.description),
    datasets: [
      {
        label: expenses.map((expense) => expense.description),
        data: expenses.map((expense) => expense.amount),
        backgroundColor: [
          'rgba(116, 124, 53, 0.7)',
          'rgba(169, 18, 86, 0.4)',
          'rgba(30, 216, 74, 1)',
          'rgba(249, 114, 117, 0.8)',
          'rgba(65, 218, 142, 0.6)',
          'rgba(207, 197, 220, 0.9)',
          'rgba(39, 119, 44, 0.3)',
          'rgba(167, 255, 173, 0.3)',
          'rgba(90, 202, 109, 0.4)',
          'rgba(8, 189, 52, 0.6)',
          'rgba(66, 214, 135, 0.8)',
          'rgba(140, 148, 180, 0.8)',
        ],
        borderColor: [
          'rgba(116, 124, 53, 0.7)',
          'rgba(169, 18, 86, 0.4)',
          'rgba(30, 216, 74, 1)',
          'rgba(249, 114, 117, 0.8)',
          'rgba(65, 218, 142, 0.6)',
          'rgba(207, 197, 220, 0.9)',
          'rgba(39, 119, 44, 0.3)',
          'rgba(167, 255, 173, 0.3)',
          'rgba(90, 202, 109, 0.4)',
          'rgba(8, 189, 52, 0.6)',
          'rgba(66, 214, 135, 0.8)',
          'rgba(140, 148, 180, 0.8)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const { t } = useTranslation()
  /*   console.log("individual budget", budget);
  const totalamount = expenses.map((expense) => expense.amount);
  const sum = totalamount.reduce((a, b) => a + b, 0);
  console.log(sum);

  const classNames = [];
  const max = this.budget.max;
  const ratio = sum / max;
  if (ratio < 0.5) {
    classNames.push("bg-primary", "bg-opacity-25");
  } else if (ratio < 0.75) {
    classNames.push("bg-warning", "bg-opacity-25");
  } else if (ratio < 0.95) {
    classNames.push("bg-danger", "bg-opacity-25");
  } else if (ratio === 1) {
    classNames.push("bg-danger", "bg-opacity-50");
  } else if (sum > max) {
    classNames.push("bg-danger", "bg-opacity-90");
  } */

  return (
    <Modal show={budgetId != null} onHide={handleClose}>
      <Card>
        <Modal.Header closeButton>
          <Modal.Title className='w-100'>
            <Stack direction='horizontal' gap='2'>
              <div className='top'>
                <div className='top__expenses'>
                  <span className='top__expenses-title'>
                    {t('main.expenses')} - {budget?.name}{' '}
                  </span>
                </div>
                {budgetId !== UNCATEGORIZED_BUDGET_ID && (
                  <Button
                    className='top__expenses-button'
                    onClick={() => {
                      deleteBudget(budget)
                      handleClose()
                    }}
                    variant='outline-danger'
                  >
                    {t('buttons.delete')}
                  </Button>
                )}
              </div>
            </Stack>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Stack direction='vertical' gap='3'>
            {expenses.length > 0 ? (
              <div>
                {expenses.map((expense) => (
                  <Stack direction='horizontal' gap='2' key={expense.id}>
                    <div className='envelope'>
                      <div className='info'>
                        <div className='info__description-amount'>
                          <div>
                            <span className='expense__dscription'>
                              {expense.description}
                            </span>
                          </div>
                          <div>
                            <span className='expense__amount'>
                              {currencyFormatter.format(expense.amount)}
                            </span>
                          </div>
                        </div>
                        <div className='info__notes'>
                          <span className='expense__notes'>
                            {expense.notes}
                          </span>
                        </div>
                      </div>
                      <Button
                        className='button__deletion'
                        onClick={() => deleteExpense(expense)}
                        variant='outline-danger'
                      >
                        &times;
                      </Button>
                    </div>
                  </Stack>
                ))}
              </div>
            ) : (
              <div>{t('messages.noexpenses')}</div>
            )}
          </Stack>
        </Modal.Body>
        <Modal.Body>
          <Doughnut data={data} />
        </Modal.Body>
      </Card>
    </Modal>
  )
}
