const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv').config()

const users = require('./routes/api/users')

const day_posts = require('./routes/api/day_posts')
const trackers = require('./routes/api/trackers')
const list = require('./routes/api/list')

const budget = require('./routes/api/budget')
const transaction = require('./routes/api/transaction')

const { checkToken } = require('./middleware/auth')

const mongoUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}?retryWrites=true&w=majority`
/* using dotenv for passwords */
/* THIS IS TEMPORARY, DB NEEDS TO BE UPDATED FOR PRODUCTION! TODO: */

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
app.use(
  cors({
    origin: '*',
  })
)
// TODO: return to this cors config. Improve when possible.

app.use(bodyParser.json())
app.use(checkToken)
app.use('/api/users', users)

app.use('/api/day_posts', day_posts)

app.use('/api/trackers', trackers)

app.use('/api/lists', list)

app.use('/api/budgets', budget)

app.use('/api/transactions', transaction)

app.use(express.static('client/build'))

if (process.env.NODE_ENV === 'production') {
  const path = require('path')
  app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'))
  })
}

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
