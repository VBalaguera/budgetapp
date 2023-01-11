const Note = require('../models/notes_model')

async function getNotes(req, res, next) {
  try {
    const notes = await Note.find({ user: req.params.id })

    return res.status(200).json({
      success: true,
      count: notes.length,
      data: notes,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server Error while getting notes.',
    })
  }
}

async function addNote(req, res, next) {
  try {
    const note = await Note.create(req.body)

    return res.status(201).json({ success: true, data: note })
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
        error: 'Server Error while adding note.',
      })
    }
  }
}

async function deleteNote(req, res, next) {
  try {
    const note = await Note.findById(req.params.id)

    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Note not found',
      })
    }

    await note.remove()

    return res.status(200).json({
      success: true,
      data: {},
    })
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: 'Server Error while deleting note.' })
  }
}

module.exports = {
  getNotes,
  addNote,
  deleteNote,
}
