const mongoose = require('mongoose')
const aggregatePaginate = require('mongoose-aggregate-paginate-v2')
require('dotenv').config()

const articleSchema = mongoose.Schema({
  title: {
    type: String,
    maxLength: 100,
    required: [true, 'You need a title'],
  },
  content: {
    type: String,
    required: [true, 'You need some content'],
  },
  excerpt: {
    type: String,
    required: [true, 'Please add an excerpt'],
    maxLength: 500,
  },
  author: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    index: true,
  },
  tags: {
    type: [String],
    required: true,
    validate: {
      validator: function (array) {
        return array.length >= 2
      },
      message: 'you must add at least three',
    },
  },
  status: {
    type: String,
    required: true,
    enum: ['draft', 'public'],
    default: 'draft',
    index: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

articleSchema.plugin(aggregatePaginate)

const Article = mongoose.model('Article', articleSchema)
module.exports = { Article }
