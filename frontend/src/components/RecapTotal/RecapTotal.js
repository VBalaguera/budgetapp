import React from 'react'
import { useBudgets } from '../../context/BudgetsContext'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

import { Doughnut } from 'react-chartjs-2'
import './RecapTotal.css'
import { Card } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { currencyFormatter } from '../../utils'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function RecapTotal() {
  const { t } = useTranslation()
  // FIXME:
  const { budgets, getBudgetExpenses } = useBudgets()

  const max = budgets.reduce((total, budgets) => total + budgets.max, 0)
  if (max === 0) return null

  const data = {
    // FIXME:
    labels: budgets.map((budget) => budget.name),
    datasets: [
      {
        label: budgets.map((budget) => budget.name),
        data: budgets.map((budget) => budget.max),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
    budgetLabels: budgets.map((budget) => budget),
  }

  return (
    <div>
      <div className='recap__total_content-info'>
        <h4 className='recap__total_content-info__text'>{t('total.index')}</h4>
      </div>
      <div className='recap__total_content'>
        <Card.Title className='title'></Card.Title>
        <div className='recap__total_content-chart'>
          <Doughnut data={data} />
        </div>
        <div className='recap__total_content-data'>
          <div className='recap__total_content-data__budgets'>
            <p className='recap__total_content-data__budgets-title'>
              {t('total.summary')}
            </p>

            {budgets.map((budget) => {
              const amount = getBudgetExpenses(budget.id).reduce(
                (total, expense) => total + expense.amount,
                0
              )
              const availableFonds = budget.max - amount

              const classNames = []

              const ratio = amount / budget.max
              // FIXME: revisit this and improve
              if (ratio < 0.5) {
                classNames.push('')
              } else if (ratio < 0.75) {
                classNames.push('bg-warning', 'bg-opacity-25')
              } else if (ratio < 0.95) {
                classNames.push('bg-danger', 'bg-opacity-25')
              } else if (ratio === 1) {
                classNames.push('bg-danger', 'bg-opacity-50')
              } else if (amount > budget.max) {
                classNames.push('bg-danger', 'bg-opacity-90')
              }

              return (
                <div
                  className='recap__total_content-data__budgets-budget'
                  key={budget.id}
                >
                  <p className='recap__total_content-data__budgets-budget__title'>
                    {budget.name}
                  </p>
                  <p className='recap__total_content-data__budgets-description'>
                    <i>{budget.description}</i>
                  </p>

                  <div className='recap__total_content-data__budgets-budget__total'>
                    <p>{t('total.initial')}</p>
                    <p>{currencyFormatter.format(budget.max)}</p>
                  </div>
                  <div className='recap__total_content-data__budgets-budget__expenses'>
                    <p>{t('total.spent')}</p>
                    <p>{currencyFormatter.format(amount)}</p>
                  </div>
                  <div className='recap__total_content-data__budgets-budget__available'>
                    <p>{t('total.available')}</p>
                    <p className={classNames.join(' ')}>
                      {currencyFormatter.format(availableFonds)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
          <br />
        </div>
      </div>
    </div>
  )
}
