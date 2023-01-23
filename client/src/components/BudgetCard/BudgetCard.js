import React from 'react'
import { Card, ProgressBar, Stack, Button } from 'react-bootstrap'
import './BudgetCard.css'

//formatting
import { currencyFormatter } from '../../utils/tools'

import { useTranslation } from 'react-i18next'

export default function BudgetCard({
  name,
  amount,
  description,
  max,
  grey,
  onAddExpenseClick,
  hideButtons,
  onViewExpenseClick,
}) {
  const classNames = []

  const ratio = amount / max
  // FIXME: revisit this and improve
  if (ratio < 0.5) {
    classNames.push('bg-primary', 'bg-opacity-25')
  } else if (ratio < 0.75) {
    classNames.push('bg-warning', 'bg-opacity-25')
  } else if (ratio < 0.95) {
    classNames.push('bg-danger', 'bg-opacity-25')
  } else if (ratio === 1) {
    classNames.push('bg-danger', 'bg-opacity-50')
  } else if (amount > max) {
    classNames.push('bg-danger', 'bg-opacity-50')
  } else if (grey) {
    classNames.push('bg-light')
  }

  function getProgressBarVariant(amount, max) {
    const ratio = amount / max
    if (ratio < 0.5) return 'primary'
    if (ratio < 0.75) return 'warning'
    if (ratio < 0.95) return 'danger'
    return 'danger'
  }

  const { t } = useTranslation()

  return (
    <Card className={classNames.join(' ')}>
      <Card.Body>
        <Card.Title className='title'>
          <div className='budgetcard__info'>
            <div className='budgetcard__info__title-amount'>
              <div>
                <span className='name'>{name}</span>
              </div>
              <div className='budget__amounts'>
                <span>{currencyFormatter.format(amount)}</span>
                {max && (
                  <span className='budget__amounts-total'>
                    / {currencyFormatter.format(max)}
                  </span>
                )}
              </div>
            </div>
            <div>
              <span className='description'>{description}</span>
            </div>
          </div>
        </Card.Title>
        {max && (
          <ProgressBar
            variant={getProgressBarVariant(amount, max)}
            min={0}
            max={max}
            now={amount}
          ></ProgressBar>
        )}
        {!hideButtons && (
          <Stack direction='horizontal' gap='2' className='mt-2'>
            <Button variant='outline-secondary' onClick={onAddExpenseClick}>
              {t('buttons.addExpense')}
            </Button>
            <Button onClick={onViewExpenseClick} variant='secondary'>
              {t('buttons.viewExpenses')}
            </Button>
          </Stack>
        )}
      </Card.Body>
    </Card>
  )
}
