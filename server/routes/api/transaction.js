const express = require('express')
const router = express.Router()
const controller = require('../../controllers/transaction_controllers.js')

router
  .route('/')
  .get(controller.getTransactions)
  .post(controller.addTransaction)

router.route('/:id').delete(controller.deleteTransaction)

module.exports = router
