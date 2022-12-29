const routes = require('express').Router()
const controller = require('../../controllers/budget_controllers.js')

routes
  .route('/categories')
  .post(controller.create_Categories)
  .get(controller.get_Categories)

routes
  .route('/transactions')
  .post(controller.create_Transaction)
  .get(controller.get_Transactions)
  .delete(controller.delete_Transaction)

routes.route('/labels').get(controller.get_Labels)

module.exports = routes
