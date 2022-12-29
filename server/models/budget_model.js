const mongoose = require('mongoose')

const Schema = mongoose.Schema
// TODO: clean all imports in other model files using this

// categories => field => ['type', 'color']
const categories_model = new Schema({
  type: { type: String, default: 'Investment' },
  color: { type: String, default: '#FCBE44' },
})

// transactions  => field => ['name', 'type', 'amount', 'date']
const transaction_model = new Schema({
  user: {
    type: String,
    required: [true, 'You need to specify an user'],
  },
  name: { type: String, default: 'Anonymous' },
  type: { type: String, default: 'Investment' },
  amount: { type: Number },
  date: { type: Date, default: Date.now },
})

const Categories = mongoose.model('categories', categories_model)
const Transaction = mongoose.model('transaction', transaction_model)

exports.default = Transaction
module.exports = {
  Categories,
  Transaction,
}
