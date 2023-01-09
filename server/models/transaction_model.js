const mongoose = require('mongoose')

const Schema = mongoose.Schema

const TransactionSchema = new Schema({
  text: {
    type: String,
    trim: true,
    required: [true, 'Please add some text'],
  },
  amount: {
    type: Number,
    required: [true, 'Please add a positive or negative number'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: String,
    required: [true, 'You need to specify an user'],
  },
})

module.exports = mongoose.model('Transaction', TransactionSchema)
