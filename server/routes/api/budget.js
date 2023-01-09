const express = require('express')
const router = express.Router()
const controller = require('../../controllers/budget_controllers.js')

router
  .route('/categories')
  .post(controller.create_Categories)
  .get(controller.get_Categories)

router
  .route('/transactions')
  .post(controller.create_Transaction)
  .get(controller.get_Transactions)
  .delete(controller.delete_Transaction)

router.route('/labels').get(controller.get_Labels)

module.exports = router
