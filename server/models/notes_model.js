const mongoose = require('mongoose')
const Schema = mongoose.Schema
const aggregatePaginate = require('mongoose-aggregate-paginate-v2')

const notes_Schema = new Schema({
  text: {
    type: String,
    required: [true, 'Please add some text'],
  },
  content: {
    type: String,
    required: [true, 'Please add some content'],
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
  },
  finished: {
    type: Boolean,
    default: false,
  },
  reminder: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  date: {
    type: String,
    required: [true, 'Please add a date'],
  },
  user: {
    type: String,
    required: [true, 'You need to specify an user'],
  },
})

notes_Schema.plugin(aggregatePaginate)
module.exports = mongoose.model('Note', notes_Schema)
