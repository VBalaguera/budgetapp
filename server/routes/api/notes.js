const express = require('express')
const router = express.Router()
const controller = require('../../controllers/notes_controllers.js')

router.route('/:id').get(controller.getNotes)

router.route('/create-note').post(controller.addNote)

router.route('/delete-note/:id').delete(controller.deleteNote)

router.route('/update-note/:id').patch(controller.updateNote)
router.route('/update-note-status/:id').patch(controller.updateNoteStatus)

module.exports = router
