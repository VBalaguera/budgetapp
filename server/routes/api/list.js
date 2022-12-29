const express = require('express')
let router = express.Router()
require('dotenv').config()
const { checkLoggedIn } = require('../../middleware/auth')
const { grantAccess } = require('../../middleware/roles')
const { sortArgsHelper } = require('../../config/helpers')

const { List } = require('../../models/list_model')

// add a list
router
  .route('/create/add_list')
  .post(checkLoggedIn, grantAccess('createOwn', 'list'), async (req, res) => {
    try {
      const list = new List({
        ...req.body,
      })

      const result = await list.save()
      res.status(200).json(result)
    } catch (error) {
      res.status(400).json({ message: 'error adding list', error: error })
    }
  })

module.exports = router
