# MERN IMPLEMENTATION

(Here I will register all information about the MERN implementation, which begun on Dec 27th, 2022).

For starters: I created a folder called server, which contains code from a previous MERN project for blackguard. The idea is to adapt it into what I need, which is:

Using a MongoDB + Node and Express.js backend:

- Users can register.
- Users can create their own days_post (a simple [String] model and a date, so far, user, and a status).
- About Day_post:
  - it automatically generates a date after publication.
  - user registers the current user's id.
  - status is a [subdocument](https://mongoosejs.com/docs/subdocs.html) which specifies current content's status.

Localhost is located at port 3001 for the backend.
And 3000 for the frontend.

## FIRST OF ALL, ROLES;

Who can do what. This is set in server/config/roles.js:

```js
const AccessControl = require('accesscontrol')

let grantsObject = {
  admin: {
    profile: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    articles: {
      'read:any': ['*'],
    },
    article: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    projects: {
      'read:any': ['*'],
    },
    project: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    proyectos: {
      'read:any': ['*'],
    },
    proyecto: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    posts: {
      'read:any': ['*'],
    },
    post: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    blackguard_posts: {
      'read:any': ['*'],
    },
    blackguard_post: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    days_posts: {
      'read:any': ['*'],
    },
    days_post: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    publicaciones: {
      'read:any': ['*'],
    },
    publicacion: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    tmiks: {
      'read:any': ['*'],
    },
    tmik: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
  },
  // now this is the interesting part, read and crud your own stuff:
  user: {
    profile: {
      'read:own': ['*', '!password', '!_id', '!date'],
      'update:own': ['*'],
    },
    days_posts: {
      'read:own': ['*'],
    },
    days_post: {
      'create:own': ['*'],
      'read:own': ['*'],
      'update:own': ['*'],
      'delete:own': ['*'],
    },
  },
}

const roles = new AccessControl(grantsObject)

module.exports = { roles }
```

Once that is done, you need some data models to define.

## DAY_POST DATA MODELS

```js
const mongoose = require('mongoose')
const aggregatePaginate = require('mongoose-aggregate-paginate-v2')
require('dotenv').config()

// subdocument to specify post and
const content_Schema = new mongoose.Schema({
  text: String,
  status: Number,
})

const day_PostSchema = mongoose.Schema({
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
```

As it is, current data model is a simple, straightforward one. From the backend side, that is.

Now it is time to create api routes.

## API ROUTES FOR DAY_POSTS

In server/routes/api/day_posts.js:

```js
const express = require('express')
let router = express.Router()
require('dotenv').config()
const { checkLoggedIn } = require('../../middleware/auth')
const { grantAccess } = require('../../middleware/roles')
const { sortArgsHelper } = require('../../config/helpers')

/* model */
const { Day_Post } = require('../../models/day_model')

router.route('/create/add_day_post').post(
  checkLoggedIn,
  grantAccess('createOwn', 'days_post'),
  // instead of createAny
  async (req, res) => {
    try {
      const day_post = new Day_Post({
        ...req.body,
      })

      const result = await day_post.save()
      res.status(200).json(result)
    } catch (error) {
      res.status(400).json({ message: 'error adding day', error: error })
    }
  }
)

router
  .route('/create/:id')
  .get(checkLoggedIn, grantAccess('readOwn', 'days_post'), async (req, res) => {
    try {
      const _id = req.params.id
      const day_post = await Day_Post.findById(_id)
      if (!day_post || day_post.length === 0) {
        return res.status(400).json({ message: 'Post not found' })
      }
      res.status(200).json(day_post)
    } catch (error) {
      res.status(400).json({ message: 'Error fetching day_post', error })
    }
  })
  .patch(
    checkLoggedIn,
    grantAccess('updateOwn', 'days_post'),
    async (req, res) => {
      try {
        const _id = req.params.id
        const day_post = await Day_Post.findOneAndUpdate(
          { _id },
          {
            $set: req.body,
          },
          {
            new: true,
          }
        )
        if (!day_post) return res.status(400).json({ message: 'Day not found' })
        res.status(200).json(day_post)
      } catch (error) {
        res.status(400).json({ message: 'Error updating day', error })
      }
    }
  )
  .delete(
    checkLoggedIn,
    grantAccess('deleteOwn', 'days_post'),
    async (req, res) => {
      try {
        const _id = req.params.id
        const day_post = await Day_Post.findByIdAndRemove(_id)
        if (!day_post) return res.status(400).json({ message: 'day not found' })
        res.status(200).json({ _id: day_post._id })
      } catch (error) {
        res.status(400).json({ message: 'Error deleting', error })
      }
    }
  )

router
  .route('/create/paginate')
  .post(
    checkLoggedIn,
    grantAccess('readOwn', 'days_posts'),
    async (req, res) => {
      try {
        // let aggQuery = Post.aggregate([
        //     { $match: { status:"public" }},
        //     { $match: { title:{ $regex:/Lorem/ }}}
        // ])

        const limit = req.body.limit ? req.body.limit : 5
        const aggQuery = Day_Post.aggregate()
        const options = {
          page: req.body.page,
          limit,
          sort: { _id: 'desc' },
        }

        const day_posts = await Day_Post.aggregatePaginate(aggQuery, options)
        res.status(200).json(day_posts)
      } catch (error) {
        res.status(400).json({ message: 'Error', error })
      }
    }
  )

/* no auth required */
router.route('/get_byid/:slug').get(async (req, res) => {
  try {
    const slug = req.params.slug
    const day_Post = await Day_Post.find({
      slug: slug,
      /*       status: 'public', */
    })
    if (!day_Post || Day_Post.length === 0) {
      return res.status(400).json({ message: 'Post not found' })
    }
    res.status(200).json(day_Post)
  } catch (error) {
    res.status(400).json({ message: 'Error fetching Day_Post', error })
  }
})

router.route('/loadmore').post(async (req, res) => {
  try {
    let sortArgs = sortArgsHelper(req.body)

    const day_posts = await Day_Post.find()
      .sort([[sortArgs.sortBy, sortArgs.order]])
      .skip(sortArgs.skip)
      .limit(sortArgs.limit)

    res.status(200).json(day_posts)
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Error fetching Day_Post', error })
  }
})

module.exports = router
```

These are the current routes. Now, bring them to server.js so I can use them:

```js
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv').config()

const users = require('./routes/api/users')

const tmiks = require('./routes/api/tmiks')
const blackguard_posts = require('./routes/api/blackguard_posts')
const day_posts = require('./routes/api/day_posts')

const { checkToken } = require('./middleware/auth')

const mongoUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}?retryWrites=true&w=majority`
/* using dotenv for passwords */
/* THIS IS TEMPORARY, DB NEEDS TO BE UPDATED FOR PRODUCTION! TODO: */

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

app.use(bodyParser.json())
app.use(checkToken)
app.use('/api/users', users)

app.use('/api/tmiks', tmiks)
app.use('/api/blackguard_posts', blackguard_posts)

app.use('/api/day_posts', day_posts)

/* every time this is in prod: */
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
```

And all is good in the world for now.

Now what must be done is to set those functionalities in the frontend side.

There was a cors related problem. To fix it, you need to add this on server.js:

```js

```

On frontend/src/services/auth.service.js, you need to make sure what you're sending to the backend is correct:

```js
const login = (email, password) => {
  return axios
    .post(API_URL + 'signin', {
      email,
      password,
    })
    .then((response) => {
      if (response.data.access) {
        localStorage.setItem('userInfo', JSON.stringify(response.data))
      }

      return response.data
    })
}
```
