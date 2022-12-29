const express = require('express')
let router = express.Router()
require('dotenv').config()
const { checkLoggedIn } = require('../../middleware/auth')
const { grantAccess } = require('../../middleware/roles')
const { sortArgsHelper } = require('../../config/helpers')

const { Tracker_Habit, Tracker_Hours } = require('../../models/trackers_model')

// add a habit tracker
router
  .route('/create/add_habit_tracker')
  .post(
    checkLoggedIn,
    grantAccess('createOwn', 'tracker_habit'),
    async (req, res) => {
      try {
        const habit_tracker = new Tracker_Habit({
          ...req.body,
        })

        const result = await habit_tracker.save()
        res.status(200).json(result)
      } catch (error) {
        res
          .status(400)
          .json({ message: 'error adding habit tracker', error: error })
      }
    }
  )

// add a hour tracker
router
  .route('/create/add_hour_tracker')
  .post(
    checkLoggedIn,
    grantAccess('createOwn', 'tracker_hour'),
    async (req, res) => {
      try {
        const hour_tracker = new Tracker_Hours({
          ...req.body,
        })

        const result = await hour_tracker.save()
        res.status(200).json(result)
      } catch (error) {
        res
          .status(400)
          .json({ message: 'error adding habit tracker', error: error })
      }
    }
  )

module.exports = router
