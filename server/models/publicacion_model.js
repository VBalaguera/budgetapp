const mongoose = require('mongoose')
const aggregatePaginate = require('mongoose-aggregate-paginate-v2')
require('dotenv').config()

/* slugs */
;(slug = require('mongoose-slug-updater')), mongoose.plugin(slug)

const publicacionSchema = mongoose.Schema({
  title: {
    type: String,
    maxLength: 250,
    required: [true, 'You need a title'],
  },
  slug: {
    type: String,
    maxLength: 250,
    required: [true, 'You need a slug'] /* todo! revise this */,
    slug: 'title',
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
  thumbnail: {
    type: String,
    maxLength: 500,
    required: [true, 'Please add a thumbnail'],
  },
  author: {
    type: String,
    required: true,
  },
  category: {
    type: [String],
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

publicacionSchema.plugin(aggregatePaginate)

const Publicacion = mongoose.model('Publicacion', publicacionSchema)
module.exports = { Publicacion }
