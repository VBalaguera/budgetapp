const mongoose = require('mongoose')
const aggregatePaginate = require('mongoose-aggregate-paginate-v2')
require('dotenv').config()

const covered_Schema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  confirmed: Boolean,
})

const content_Schema = new mongoose.Schema({
  habit: String,
  covered: [covered_Schema],
})

const tracker_habits_Schema = new mongoose.Schema({
  title: String,
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

const tracker_hours_Schema = new mongoose.Schema({
  title: String,
  content: [
    {
      topic: String,
      hours: [
        {
          date: {
            type: Date,
            default: Date.now,
          },
          hours: Number,
        },
      ],
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: String,
    required: [true, 'You need to specify an user'],
  },
})

tracker_habits_Schema.plugin(aggregatePaginate)
tracker_hours_Schema.plugin(aggregatePaginate)

const Tracker_Habit = mongoose.model('Tracker_Habit', tracker_habits_Schema)
const Tracker_Hours = mongoose.model('Tracker_Hours', tracker_hours_Schema)
module.exports = { Tracker_Habit, Tracker_Hours }
