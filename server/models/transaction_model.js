const mongoose = require('mongoose')
const Schema = mongoose.Schema
const aggregatePaginate = require('mongoose-aggregate-paginate-v2')

const TransactionSchema = new Schema({
  text: {
    type: String,
    required: [true, 'Please add some text'],
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
  },
  amount: {
    type: Number,
    required: [true, 'Please add a positive or negative number'],
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

TransactionSchema.plugin(aggregatePaginate)

module.exports = mongoose.model('Transaction', TransactionSchema)
