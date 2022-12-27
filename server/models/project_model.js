const mongoose = require('mongoose')
const aggregatePaginate = require('mongoose-aggregate-paginate-v2')
require('dotenv').config()

const projectSchema = mongoose.Schema({
  title: {
    type: String,
    maxLength: 250,
    required: [true, 'You need a title'],
  },
  subtitleDate: {
    type: String,
    maxLength: 250,
    required: [true, 'You need a slug'] /* todo! revise this */,
  },
  url: {
    type: String,
    required: [true, 'You need an url'],
  },
  description: {
    type: String,
    required: [true, 'Please add an excerpt'],
    maxLength: 500,
  },
  tools: {
    type: [String],
    required: true,
    validate: {
      validator: function (array) {
        return array.length >= 1
      },
      message: 'you must add at least one tool',
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    required: true,
    enum: ['draft', 'public'],
    default: 'draft',
    index: true,
  },
})

projectSchema.plugin(aggregatePaginate)

const Project = mongoose.model('Project', projectSchema)
module.exports = { Project }
