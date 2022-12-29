const budget_model = require('../models/budget_model')

// TODO: implement checkLoggedIn and grantAccess!

// categories:

// create category:

async function create_Categories(req, res) {
  const Create = new budget_model.Categories({
    type: 'Expense',
    color: 'red',
  })

  //   type: 'Investment',
  //     color: 'green',
  // type: 'Savings',
  //     color: 'blue',
  //   type: 'Expense',
  //     color: 'red',

  // creating category instance
  await Create.save(function (error) {
    if (!error) return res.json(Create)

    return res
      .status(400)
      .json({ message: 'error creating category', error: error })
  })
}

// get categories:
async function get_Categories(req, res) {
  const data = await budget_model.Categories.find({})

  // filtering props on backend side
  const filter = await data.map((budget) =>
    Object.assign({}, { type: budget.type, color: budget.color })
  )
  return res.json(filter)
}

// transaction:

// create transaction:

async function create_Transaction(req, res) {
  if (!req.body) return res.status(400).json({ message: 'Data not provided.' })
  const { name, type, amount, user } = req.body

  const create = new budget_model.Transaction({
    name,
    type,
    amount,
    user,
    date: new Date(),
  })

  create.save(function (error) {
    if (!error) return res.json(create)

    return res
      .status(400)
      .json({ message: 'Error creating transaction.', error: error })
  })
}

// get transactions:

async function get_Transactions(req, res) {
  const data = await budget_model.Transaction.find({})

  return res.json(data)
}

// delete transaction:

async function delete_Transaction(req, res) {
  if (!req.body) res.status(400).json({ message: 'Transaction not found' })

  await budget_model.Transaction.deleteOne(req.body, function (error) {
    if (!error) res.json('Transaction deleted.')
  })
    .clone()
    .catch(function (error) {
      return res.json('Error while deleting transaction.')
    })
}

// using aggregators to aggregate values from categories into transactions
async function get_Labels(req, res) {
  budget_model.Transaction.aggregate([
    {
      // lookup: a key for a specific key in a collection
      $lookup: {
        from: 'categories', // collection I want to join with
        localField: 'type',
        foreignField: 'type', // linking these models with the same key!
        // result:
        as: 'categories_info',
      },
    },
    {
      $unwind: '$categories_info',
      // Deconstructs an array field from the input documents to output a document for each element.
    },
  ])
    .then((result) => {
      const data = result.map((value) =>
        Object.assign(
          {},
          {
            _id: value._id,
            name: value.name,
            type: value.type,
            amount: value.amount,
            color: value.categories_info['color'],
          }
        )
      )
      res.json(data)
    })
    .catch((error) => {
      res.status(400).json('Looup Collection Error')
    })
}
module.exports = {
  create_Categories,
  get_Categories,
  create_Transaction,
  get_Transactions,
  delete_Transaction,
  get_Labels,
}
