const Transaction = require('../models/transaction_model')

async function getTransactions(req, res, next) {
  try {
    const transactions = await Transaction.find({ user: req.body.user })

    return res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    })
  }
}

async function addTransaction(req, res, next) {
  try {
    const { text, amount } = req.body

    const transaction = await Transaction.create(req.body)

    return res.status(201).json({ success: true, data: transaction })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((value) => value.message)

      return res.status(400).json({
        success: false,
        error: messages,
      })
    } else {
      return res.status(500).json({
        success: false,
        error: 'Server Error',
      })
    }
  }
}

async function deleteTransaction(req, res, next) {
  try {
    const transaction = await Transaction.findById(req.params.id)

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found',
      })
    }

    await transaction.remove()

    return res.status(200).json({
      success: true,
      data: {},
    })
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Server Error' })
  }
}

module.exports = {
  getTransactions,
  addTransaction,
  deleteTransaction,
}
