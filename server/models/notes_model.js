const mongoose = require('mongoose')
const Schema = mongoose.Schema
const aggregatePaginate = require('mongoose-aggregate-paginate-v2')
require('dotenv').config()

const notes_Schema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: [true, 'You need to specify a date'],
  },
  category: {
    type: String,
    required: [true, 'You need to specify a category'],
  },
  text: {
    type: String,
    required: [true, 'You need to write some text first'],
  },
})

notes_Schema.plugin(aggregatePaginate)

const Notes = mongoose.model('Notes', notes_Schema)
module.exports = { Notes }
