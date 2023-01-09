import React, { useState, useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { getTransactions } from '../store/transaction/transactionSlice'

import { currencyFormatter } from '../utils/tools'
import data from '../mockData/transactions.json'

import Layout from '../components/Layout/Layout'
import Transaction from '../components/Transaction/Transaction'

function TransactionsPage() {
  const [transactionsMockups, setTransactions] = useState([])
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getTransactions())
    setTransactions(data)
  }, [])

  const { transactions, isLoadingTransactions } = useSelector(
    (state) => state.transactions
  )

  const amounts = transactionsMockups.map(
    (transactionsMockup) => transactionsMockup.amount
  )

  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2)

  const expense = (
    amounts.filter((item) => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2)

  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2)

  return (
    <Layout>
      <div>
        <h2>transactions</h2>
        {isLoadingTransactions ? (
          <span>loading</span>
        ) : (
          transactions.map((transactionsMockup) => (
            <Transaction
              key={transactionsMockup._id}
              transaction={transactionsMockup}
            />
          ))
        )}
      </div>
      <div className='bg-success my-2 p-3'>
        <h2>income</h2>
        <span>{currencyFormatter.format(income)}</span>
      </div>
      <div className='bg-danger my-2 p-3'>
        <h2>expenses</h2>

        <span>{currencyFormatter.format(expense)}</span>
      </div>
      <div>
        <h2>total</h2>
        <span>{total}</span>
      </div>
    </Layout>
  )
}

export default TransactionsPage
