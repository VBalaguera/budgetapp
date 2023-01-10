const express = require('express')
const router = express.Router()
const controller = require('../../controllers/notes_controllers.js')

router.route('/:id').get(controller.getNotes)

router.route('/create-note').post(controller.addNote)

router.route('/delete-note/:id').delete(controller.deleteNote)

module.exports = router
