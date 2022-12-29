const mongoose = require('mongoose')
const aggregatePaginate = require('mongoose-aggregate-paginate-v2')
require('dotenv').config()

const Schema = mongoose.Schema

// subdocument to specify post and
const content_Schema = new Schema({
  text: String,
  status: Number,
})

const day_PostSchema = Schema({
  content: [content_Schema],

  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: String,
    required: [true, 'You need to specify an user'],
  },
})

day_PostSchema.plugin(aggregatePaginate)

const Day_Post = mongoose.model('Day_Post', day_PostSchema)
module.exports = { Day_Post }
