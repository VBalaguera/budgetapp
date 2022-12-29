const mongoose = require('mongoose')
const aggregatePaginate = require('mongoose-aggregate-paginate-v2')
require('dotenv').config()

const list_Schema = new mongoose.Schema({
  title: String,
  date: { type: Date, default: Date.now },
  content: [{ element: String }],
  user: {
    type: String,
    required: [true, 'You need to specify an user'],
  },
})

list_Schema.plugin(aggregatePaginate)

const List = mongoose.model('List', list_Schema)
module.exports = { List }
