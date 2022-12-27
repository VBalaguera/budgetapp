# FULLSTACK BLOG PROJECT MAY 2022

# SETTING UP SERVER

Now, creating a cluster in MongoDB. For now will be a free tier one. TODO: When this project is done but before deploying, it will need to be updated for production.

on server.js:

<code>
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv').config()

const mongoUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}?retryWrites=true&w=majority`
/_ using dotenv for passwords _/
/_ THIS IS TEMPORARY, DB NEEDS TO BE UPDATED FOR PRODUCTION! TODO: _/

mongoose.connect(mongoUri, {
useNewUrlParser: true,
useUnifiedTopology: true,
})

app.use(bodyParser.json())

const port = process.env.PORT || 3000

app.listen(port, () => {
console.log('listening on port ' + port)
})

</code>

using .env for all those variables. TODO: put .env on .gitignore when switching to production!!

npm run dev to run it!!!

## creating models:

I created this four folders:

server/middleware/
server/routes/
server/models/
server/config/

on routes/api/ create articles.js and users.js

on models/ create article_model.js and user_model.js

on user_model.js, let's take care of auth:

<code>
const mongoose = require('mongoose')
const bcrypt = require('bcrypt') /* todo: read its docs */
const jwt = require('jsonwebtoken') /* todo: ditto */
const validator = require('validator') /* to be used with forms and mongoose */

require('dotenv').config()

/_ creating schema _/
const userSchema = mongoose.Schema(
{
email: {
type: String,
required: true,
unique: true,
trim: true /_ useful for deleting spaces _/,
lowercase: true,
validate(value) {
if (!validator.isEmail(value)) {
throw new Error('invalid email address: ' + value)
}
},
},
password: {
type: String,
required: true,
trim: true,
},
role: {
type: String,
enum: ['user', 'admin'] /_ describes several roles _/,
default: 'user',
},
firstname: {
type: String,
trim: true,
maxLength: 100,
},
lastname: {
type: String,
trim: true,
maxLength: 125,
},
age: {
type: Number,
},
date: {
type: Date,
default: Date.now,
},
},
{
/_ options here _/
timestamps: true /_ mongodb will create this automatically _/,
/_ collection: "player" ; in case we want to use any other name than the default one_/
}
)

const User = mongoose.model('User', userSchema)
module.exports = { User }

</code>

## the route file

on api/users.js:

<code>
const express = require('express')
let router = express.Router()
require('dotenv').config()

const { User } = require('../../models/user_model')

/_ this also accepts controllers: router.route('register', controllerfunction()) _/
router
.route('/register')
/\* .get(() => {

}) \*/
.post((req, res) => {
res.status(200).send('users/register working')
})

module.exports = router

</code>

this file will be linked to server.js:

<code>
const users = require('./routes/api/users')

app.use("/api/users", users)
</code>

## email checking and hashing

on users.js:

<code>
const express = require('express')
let router = express.Router()
require('dotenv').config()

const { User } = require('../../models/user_model')

/_ this also accepts controllers: router.route('register', controllerfunction()) _/
router
.route('/register')
/\* .get(() => {

}) _/
.post(async (req, res) => {
try {
/_ email taken? \*/
if (await User.emailTaken(req.body.email)) {
return res.status(400).json({ message: 'Email already taken' })
}

      /* creating model (hash password) */
      const user = new User({
        email: req.body.email,
        password: req.body.password,
      })
      /* generate token */
      const doc = await user.save()

      /* send email */

      /* save and send token with cookie */
      res
        .cookie('x-access-token') /* placeholdername */
        .status(200)
        .send(doc)
    } catch (error) {
      res.status(400).json({ message: 'Error', error: error })
    }

})

module.exports = router

</code>

on user_model.js, create a middleware:

<code>
userSchema.pre('save', async function (next) {
  /* accessing user instance */
  let user = this
  if (user.isModified('password')) {
    /* hashing it */
    const salt = await bcrypt.genSalt(10) /* todo: read about this */
    const hash = await bcrypt.hash(user.password, salt)

    user.password = hash

}
next()
})
[...]
userSchema.statics.emailTaken = async function (email) {
const user = await this.findOne({ email: email })
return !!user
}

</code>

## Register users and tokens!

on users.js:

<code>
const token = user.generateToken()
[...]
.cookie('x-access-token', token) /* placeholdername */
</code>

on user_model.js:

<code>
userSchema.methods.generateToken = function () {
  /* todo: study this */
  let user = this
  const userObj = { _id: user._id.toHexString(), email: user.email }
  /* generate token, use jwt */
  const token = jwt.sign(
    userObj,
    process.env.DB_SECRET /* password from .env */,
    {
      expiresIn: '1d' /* one day before expiration */,
    }
  )
  return token
}
</code>

an alt method would be to create a token model! An improved way, but more complex and harder to do.
todo: read about creating token models!

What if we don't want to send sensitive information from the user to the db?

on users.js:

<code>
router
  .route('/register')
  /* .get(() => {

}) _/
.post(async (req, res) => {
try {
/_ email taken? \*/
if (await User.emailTaken(req.body.email)) {
return res.status(400).json({ message: 'Email already taken' })
}

      /* creating model (hash password) */
      const user = new User({
        email: req.body.email,
        password: req.body.password,
      })
      /* generate token */
      const token = user.generateToken()
      const doc = await user.save()

      /* send email */

      /* save and send token with cookie */
      res
        .cookie('x-access-token', token) /* placeholdername */
        .status(200)
        .send(getUserProps(doc))
        .send(doc)
    } catch (error) {
      res.status(400).json({ message: 'Error', error: error })
    }

})

const getUserProps = (user) => {
return {
\_id: user.\_id,
email: user.email,
firstname: user.firstname,
lastname: user.lastname,
age: user.age,
role: user.role,
}
}
</code>

## sending emails to users after registration

on users.js:

<code>

router.route('/signin').post(async (req, res) => {
/_ todo: study this _/
try {
/_ find user _/
let user = await User.findOne({
email: req.body.email,
})
if (!user) return res.status(400).json({ message: 'email not found' })

    /* check out password's validity */
    const compare = await user.comparePassword(req.body.password)

    if (!compare) return res.status(400).json({ message: 'wrong password' })

    /* generate token */
    const token = await user.generateToken()

    /* send response  */
    res.cookie('x-access-token', token).send(200).send(getUserProps(user))

} catch (error) {
res.sendStatus(400).json({ message: 'Error', error: error })
}
})
</code>

on user_model.js, we create comparePassword:

<code>

userSchema.methods.comparePassword = async function (candidatePassword) {
const user = this
const match = await bcrypt.compare(candidatePassword, user.password)
return match
}
</code>

## validating tokens

Let's say we want to validate tokens when the user access certain routes, like profile. Let's use a middleware to validate the token on each route.

on middleware/auth.js:

<code>
const { User} = require('../models/user_model');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.checkToken = async(req, res, next) => {
try{
if(req.headers["x-access-token"]){
// verify token
const accessToken = req.headers["x-access-token"];
const { \_id,email,exp } = jwt.verify(accessToken, process.env.DB_SECRET);

            res.locals.userData = await User.findById(_id);
            next()
        } else{
            next();
        }
    } catch(error){
        return res.status(401).json({error:"Bad token",errors:error})
    }

}

exports.checkLoggedIn = (req,res,next) => {
const user = res.locals.userData;
if(!user) return res.status(401).json({error:"No user.Please log in"})

    req.user = user;
    next();

}
</code>

on server.js:

<code>
const {checkToken} = require('./middleware/auth.js')
[...]
app.use(checkToken)
</code>

on user_model.js:

<code>

</code>

on users.js:

<code>
router.route('/profile').get(checkLoggedIn, async (req, res) => {
  console.log(req.user)
  res.sendStatus(200).send('profile working')
})
</code>

## creating roles:

using accesscontrol: github.com/onury/accesscontrol

created config/roles.js:

<code>
const AccessControl = require('accesscontrol')

let grantsObject = {
admin: {
profile: {
'create:any': ['*'],
'read:any': ['*'],
'update:any': ['*'],
'delete:any': ['*'],
},
},
user: {
profile: {
'read:own': ['*'],
'update:own': ['*'],
},
},
}

const roles = new AccessControl(grantsObject)

module.exports = { roles }

</code>

created middleware/roles.js:

<code>
const { roles } = require('../config/roles')

exports.grantAccess = function (action, resource) {
return async (req, res, next) => {
try {
const permission = roles.can(req.user.role)[action](resource)
if (!permission.granted) {
return res.status(400).json({
error: 'You do not have permission',
})
}
next()
} catch (error) {
next(error)
}
}
}

</code>

on users.js:

<code>
const express = require('express')
let router = express.Router()
require('dotenv').config()
const { checkLoggedIn } = require('../../middleware/auth')
const { grantAccess } = require('../../middleware/roles')
const { User } = require('../../models/user_model')

router.route('/register').post(async (req, res) => {
try {
///1 check if email taken
if (await User.emailTaken(req.body.email)) {
return res.status(400).json({ message: 'Sorry email taken' })
}

    /// 2 creating the model ( hash password)
    const user = new User({
      email: req.body.email,
      password: req.body.password,
    })

    /// 3 generate token
    const token = user.generateToken()
    const doc = await user.save()

    // 4 send email

    // save...send token with cookie
    res.cookie('x-access-token', token).status(200).send(getUserProps(doc))

} catch (error) {
res.status(400).json({ message: 'Error', error: error })
}
})

router.route('/signin').post(async (req, res) => {
try {
// FIND USER
let user = await User.findOne({ email: req.body.email })
if (!user) return res.status(400).json({ message: 'Bad email' })

    /// COMPARE PASSWORD
    const compare = await user.comparePassword(req.body.password)
    if (!compare) return res.status(400).json({ message: 'Bad password' })

    // GENERATE TOKEN
    const token = user.generateToken()

    //RESPONSE
    res.cookie('x-access-token', token).status(200).send(getUserProps(user))

} catch (error) {
res.status(400).json({ message: 'Error', error: error })
}
})

router
.route('/profile')
.get(checkLoggedIn, grantAccess('action', 'resource'), async (req, res) => {
console.log(req.user)
res.status(200).send('welcome')
})

const getUserProps = (user) => {
return {
\_id: user.\_id,
email: user.email,
firstname: user.firstname,
lastname: user.lastname,
age: user.age,
role: user.role,
}
}

module.exports = router

</code>

## testing roles:

on users.js:

<code>
router.route("/profile")
.get(checkLoggedIn,grantAccess('readOwn','profile'),async (req,res)=>{
    try {
        const permission = res.locals.permission;
        const user = await User.findById(req.user._id);
        if(!user) return res.status(400).json({message:'User not found'});

        res.status(200).json(permission.filter(user._doc));
    }catch(error){
        return res.status(400).send(error);
    }

})

</code>

on config/roles.js:

<code>

const AccessControl = require('accesscontrol');

let grantsObject = {
admin:{
profile:{
'create:any': ['*'],
'read:any': ['*'],
'update:any': ['*'],
'delete:any': ['*']
}
},
user:{
profile:{
'read:own': ['*','!password','!_id','!date'],
'update:own': ['*'],
}
}
}

const roles = new AccessControl(grantsObject);

module.exports = { roles }</code>

## updating profile:

on users.js:

<code>

</code>
.patch(
    checkLoggedIn,
    grantAccess('updateOwn', 'profile'),
    async (req, res) => {
      try {
        const user = await User.findOneAndUpdate(
          {
            _id: req.user._id,
          },
          {
            $set: {
              firstname: req.body.firstname,
              lastname: req.body.lastname,
              age: req.body.age,
            },
          },
          {
            new: true,
          }
        )
        if (!user) return res.status(400).json({ message: 'User not found.' })

        res.status(200).json(getUserProps(user))
      } catch (error) {
        res.status(400).json({ message: 'Error while updating', error: error })
      }
    }

)
<code>

router.route('/isauth').get(checkLoggedIn, async (req, res) => {
/_ no need to go to db _/
res.status(200).send(getUserProps(req.user))
})
</code>

## brief impasse: updating from react v17 to v18

index.js:

old version:

<code>

import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'

ReactDOM.render(
<React.StrictMode>
<App />
</React.StrictMode>,
document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

</code>
new version:

<code>
import React from 'react'
import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
<StrictMode>
<App />
</StrictMode>
)

</code>

More info here: https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#updates-to-client-rendering-apis

and here: https://bobbyhadz.com/blog/react-createroot-target-container-not-dom-element#:~:text=To%20solve%20the%20%22createRoot(.,that%20declares%20the%20div%20element.

## updating emails

on users.js:

<code>

router
.route('/update*email')
.patch(
checkLoggedIn,
grantAccess('updateOwn', 'profile'),
async (req, res) => {
try {
/* check out if email exists in db \_/
if (await User.emailTaken(req.body.newemail)) {
return res.status(400).json({ message: 'email already taken' })
}

        const user = await User.findOneAndUpdate(
          {
            /* what to update */ _id: req.user._id,
            email: req.body.email,
          },
          {
            $set: {
              email: req.body.newemail,
            },
          },
          {
            /* what to return */
            new: true,
          }
        )
        if (!user) return res.status(400).json({ message: 'user not found' })

        /* updating redux state */
        const token = user.generateToken()
        res
          .cookie(
            'x-access-token',
            token
          ) /* this will be updated to localstorage later on */
          .status(200)
          .send({ email: user.email })
      } catch (error) {
        res.status(400).json({ message: 'problem updating', error: error })
      }
    }

)
</code>

## articles model:

NOTE: this model is not as provided in the course. I ain't building an imdb clone but a fully functional blog. Some aspects of the model just have different names but work equally (i.e. actors and tags).

on article_model.js:

<code>
const mongoose = require('mongoose')
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

const Article = mongoose.model('Article', articleSchema)
module.exports = { Article }

</code>

on articles.js:

<code>
const express = require('express')
let router = express.Router()
require('dotenv').config()
const { checkLoggedIn } = require('../../middleware/auth')
const { grantAccess } = require('../../middleware/roles')

/_ model _/
const { Article } = require('../../models/article_model')

/_ only the admin can do this _/
router
.route('/admin/add*articles')
.post(
checkLoggedIn,
grantAccess('createAny', 'article'),
async (req, res) => {
try {
/* validation would be here, but atm is not necessary \_/
const article = new Article({
...req.body,
})

        const result = await article.save()
        res.status(200).json(result)
      } catch (error) {
        res.status(400).json({ message: 'error adding article', error: error })
      }
    }

)

module.exports = router

</code>

on roles.js:
<code>
let grantsObject = {
admin: {
profile: {
'create:any': ['*'],
'read:any': ['*'],
'update:any': ['*'],
'delete:any': ['*'],
},
article: {
'create:any': ['*'],
'read:any': ['*'],
'update:any': ['*'],
'delete:any': ['*'],
},
},
user: {
profile: {
'read:own': ['*', '!password', '!_id', '!date'],
'update:own': ['*'],
},
},
}

</code>

on server.js:

<code>
const articles = require('./routes/api/articles')

app.use('/api/articles', articles)
</code>

## updating, deleting, getting articles by id:

on articles.js:

<code>

router
.route('/admin/:id')
.get(checkLoggedIn, grantAccess('readAny', 'article'), async (req, res) => {
try {
const \_id = req.params.id
const article = await Article.findById(\_id)
if (!article || article.length === 0) {
return res.status(400).json({ message: 'Article not found' })
}
res.status(200).json(article)
} catch (error) {
res.status(400).json({ message: 'Error fetching article', error })
}
})
.patch(
checkLoggedIn,
grantAccess('updateAny', 'article'),
async (req, res) => {
try {
const \_id = req.params.id
const article = await Article.findOneAndUpdate(
{ \_id },
{
"$set": req.body,
},
{
new: true,
}
)
if (!article)
return res.status(400).json({ message: 'Article not found' })
res.status(200).json(article)
} catch (error) {
res.status(400).json({ message: 'Error updating article', error })
}
}
)
.delete(
checkLoggedIn,
grantAccess('deleteAny', 'article'),
async (req, res) => {
try {
const \_id = req.params.id
const article = await Article.findByIdAndRemove(\_id)
if (!article)
return res.status(400).json({ message: 'Article not found' })
res.status(200).json({ \_id: article.\_id })
} catch (error) {
res.status(400).json({ message: 'Error deleting', error })
}
}
)

</code>

## getting articles for guest/non identified users

on articles.js:

<code>
router.route("/get_byid/:id")
.get(async(req,res)=>{
    try{
        const _id = req.params.id;
        const article = await Article.find({_id:_id,status:'public'});
        if(!article || article.length === 0){
            return  res.status(400).json({message:'Article not found'});
        }
        res.status(200).json(article)
    } catch(error){
        res.status(400).json({message:'Error fetching article',error});
    }
})
</code>

## load more articles:

on articles.js:
<code>
const { sortArgsHelper } = require('../../config/helpers')

router.route("/loadmore")
.post(async(req,res)=>{
try{
let sortArgs = sortArgsHelper(req.body)

        const articles = await Article
        .find({status:'public'})
        .sort([[sortArgs.sortBy,sortArgs.order]])
        .skip(sortArgs.skip)
        .limit(sortArgs.limit);

        res.status(200).json(articles)
    } catch(error){
        console.log(error)
        res.status(400).json({message:'Error fetching articles',error});
    }

})</code>

created config/helpers.js

<code>
const sortArgsHelper = (sort) => {
    let sortArgs = {sortBy:"_id",order:"asc",limit:3,skip:0};

    for(key in sort){
        if(sort[key]){
            sortArgs[key] = sort[key]
        }
    }

    return sortArgs;

}

module.exports = {
sortArgsHelper
}

       // {
        //     "sortBy":"_id",
        //     "order":"asc",
        //     "limit":10,
        //     "skip":0
        // }

</code>

## pagination

on roles.js:
<code>

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
},
user: {
profile: {
'read:own': ['*', '!password', '!_id', '!date'],
'update:own': ['*'],
},
},
}
</code>

on article_model.js:

<code>
const aggregatePaginate = require('mongoose-aggregate-paginate-v2')

articleSchema.plugin(aggregatePaginate)
</code>

on articles.js:

<code>
router.route("/admin/paginate")
.post(checkLoggedIn,grantAccess('readAny','articles'),async(req,res)=>{
    try{

        // let aggQuery = Article.aggregate([
        //     { $match: { status:"public" }},
        //     { $match: { title:{ $regex:/Lorem/ }}}
        // ])

        const limit = req.body.limit ?  req.body.limit : 5;
        const aggQuery = Article.aggregate();
        const options = {
            page: req.body.page,
            limit,
            sort:{_id:'asc'}
        }

        const articles = await Article.aggregatePaginate(aggQuery,options);
        res.status(200).json(articles)
    } catch(error){
        res.status(400).json({message:'Error',error});
    }

})
</code>

SERVER IS FINISHED

# REACT

## starting with React

on client/

src/components/home/index.js:

<code>
import React from 'react'

const Home = () => {
return <div>home</div>
}

export default Home

</code>

on src/index.js:

<!-- this is using the React 18 update -->
<code>
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import RoutesFile from './routes'

/_ styles _/
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/main.css'

import { Provider } from 'react-redux'
import ReduxStore from './store'

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
<StrictMode>
<Provider store={ReduxStore()}>
<RoutesFile />
</Provider>
</StrictMode>
)

</code>

on src/routes.js:

<code>
import React from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'

import Home from './components/home'

const RoutesFile = () => {
return (
<BrowserRouter>
<Routes>
<Route path='/' element={<Home />} />
</Routes>
</BrowserRouter>
)
}

export default RoutesFile

</code>

## creating React store

inside src/, create store/

index.js:

<code>
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import appReducers from './reducers'

const ReduxStore = () => {
const composeEnhancers =
window.**REDUX_DEVTOOLS_EXTENSION_COMPOSE** || compose

const store = createStore(
appReducers,
composeEnhancers(applyMiddleware(thunk))
)
return store
}

export default ReduxStore

</code>

created navigation/sideNavigation.js

<code>

</code>

and adapt it in header.js:

<code>

</code>

There's a warning message: "findDOMNode is deprecated in StrictMode." It does not matter at the moment.
Dismiss it.

## using loadmore for articles, posts, publicaciones, posts_blackguard

on home/index.js:

<!-- todo: change this name to index/index.js? -->
<code>

</code>

actions/index.js

<code>
import { GET_ARTICLES } from '../types'

export const getArticles = (articles) => ({
type: GET_ARTICLES,
payload: articles,
})

</code>

on types.js:

<code>
export const GET_ARTICLES = 'get_articles'

</code>

create actions/article_actions.js:

<code>
import * as articles from './index'
import axios from 'axios'

axios.defaults.headers.post['Content-Type'] = 'application/json'

export const getArticles = (sort) => {
return async (dispatch, getState) => {
try {
const arts = await axios.post(`/api/articles/loadmore`, sort)
console.log(arts.data)
dispatch(articles.getArticles(arts.data))
} catch (error) {}
}
}

</code>

on home/index.js:

<code>
import {getArticles}  from '../../store/actions/article_actions'
</code>

on client/package.json:

<code>
"proxy": "http://localhost:3001"
</code>

on articles.reducer:

<code>
import { GET_ARTICLES } from '../types'

export default function articleReducer(state = {}, action) {
switch (action.type) {
case GET_ARTICLES:
return { ...state, articles: action.payload }
default:
return state
}
}

</code>

## finishing loadmore;

on index.js:

<code>
import React, { useReducer, useEffect } from 'react'
import Intro from '../intro/intro'
import ProjectsGrid from '../projectsgrid/projectsgrid'
import ArticleCard from '../../utils/articleCard'
import CTA from '../cta/cta'

/_ bringing all redux tools _/

import { useDispatch, useSelector } from 'react-redux'
import { getArticles } from '../../store/actions/article_actions'

/_ initial state _/
const initialArticleSort = { sortBy: '\_id', order: 'desc', limit: 4, skip: 0 }

const Home = () => {
/_ creating state _/
const [sort, setSort] = useReducer(
(state, newState) => ({ ...state, ...newState }),
initialArticleSort
)

/_ articles _/
const articles = useSelector((state) => state.articles)
const dispatch = useDispatch()

/_ useEffect _/
useEffect(() => {
/_ only in first render _/
if (articles && !articles.articles) {
/_ dispatch _/
dispatch(getArticles(initialArticleSort))
}
}, [dispatch, articles])

return (

<div>
<Intro />
<ProjectsGrid />
{articles && articles.articles ? (
articles.articles.map((item) => (
<ArticleCard key={item._id} article={item} />
))
) : (
<>null</>
)}
<button
onClick={() => {
let skip = sort.skip + sort.limit
dispatch(getArticles({ ...sort, skip: skip }))
setSort({ skip: skip })
}} >
load more
</button>
{/_ redo these steps with posts/publicaciones/posts_blackguard _/}
<CTA />
</div>
)
}

export default Home

</code>

on article_actions.js:

<code>
import * as articles from './index'
import axios from 'axios'

axios.defaults.headers.post['Content-Type'] = 'application/json'

export const getArticles = (sort) => {
return async (dispatch, getState) => {
try {
const arts = await axios.post(`/api/articles/loadmore`, sort)

      /* access prevState */
      const prevArts = getState().articles.articles

      /* merge of everything*/

      let newArts = [...arts.data]

      if (prevArts) {
        newArts = [...prevArts, ...arts.data]
      }

      dispatch(articles.getArticles(newArts))
    } catch (error) {}

}
}

</code>

on articleCard.js:

<code>

import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
Card,
CardMedia,
CardContent,
CardActions,
IconButton,
Typography,
Button,
} from '@material-ui/core'
import FavoriteIcon from '@material-ui/icons/Favorite'

const ArticleCard = ({ article }) => {
return (
<Card>
<CardMedia
style={{ height: 0, paddingTop: '56.25%' }}
image='https://picsum.photos/200'
title='some title'
/>
<CardContent>
<Typography gutterBottom variant='h5' component='h2'>
{article.title}
</Typography>
<Typography variant='body' component='p'>
{article.excerpt}
</Typography>
</CardContent>
<CardActions disableSpacing>
<IconButton>
<FavoriteIcon />
</IconButton>
<Button
size='small'
color='primary'
component={RouterLink}
to={`/article/id`} >
View article
</Button>
</CardActions>
</Card>
)
}
/_ delete this component when course is over _/

export default ArticleCard
</code>

## PAUSE FOR APPLYING THESE FUNCTIONALITIES TO THE FOLLOWING ELEMENTS:

- proyects
- proyectos

types.js:

<code>
export const GET_PROJECTS = 'get_projects'
export const GET_PROYECTOS = 'get_proyectos'
</code>

projects_reducer.js:

<code>

import { GET_PROJECTS } from '../types'

export default function proyectoReducer(state = {}, action) {
switch (action.type) {
case GET_PROJECTS:
return { ...state, projects: action.payload }
default:
return state
}
}

</code>

/actions/index.js:

<code>
import { GET_ARTICLES } from '../types'
import { GET_PROJECTS } from '../types'
import { GET_PROYECTOS } from '../types'

export const getArticles = (articles) => ({
type: GET_ARTICLES,
payload: articles,
})

export const getProjects = (projects) => ({
type: GET_PROJECTS,
payload: projects,
})

export const getProyectos = (proyectos) => ({
type: GET_PROYECTOS,
payload: proyectos
})

</code>

to load all contents without restrictions, use this:

<code>

router.route('/get_all').get(async (req, res) => {
try {
const projects = await Project.find()

    res.status(200).json(projects)

} catch (error) {
console.log(error)
res.status(400).json({ message: 'Error fetching projects', error })
}
})
</code>

## SO FAR WHAT WORKS IS TO DO A SIMPLE AXIOS CALL IN INDEX.JS:

<code>

const [projects, setProjects] = useState([])
const [proyectos, setProyectos] = useState([])

/_ articles _/
const articles = useSelector((state) => state.articles)
const dispatch = useDispatch()

/_ useEffect _/
useEffect(() => {
/_ only in first render _/
if (articles && !articles.articles) {
/_ dispatch _/
dispatch(getArticles(initialArticleSort))
}
/_ fetching projects and proyectos _/
const fetchProjects = async () => {
const res = await axios.get('/api/projects/get_all')
setProjects(res.data)
console.log(res.data)
}

    const fetchProyectos = async () => {
      const res = await axios.get('/api/proyectos/get_all')
      setProjects(res.data)
      console.log(res.data)
    }
    fetchProjects()
    fetchProyectos()

}, [dispatch, articles])

  </code>

for /tmik:

<code>

</code>

- posts
- publicaciones
- post-blackguards

## notifications with toast!

on layout:
<code>

import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

and <ToastContainer />
</code>

on utils/tools.js:

<code>
/* toast tools! */
import { toast } from 'react-toastify';

export const showToast = (type,msg) => {
switch(type){
case 'SUCCESS':
toast.success(msg,{
position: toast.POSITION.BOTTOM_RIGHT
})
break;
case 'ERROR':
toast.error(msg,{
position: toast.POSITION.BOTTOM_RIGHT
})
break;
default:
return false
}
}

</code>

It is necessary to bring this into our actions, since I am using this notifications over there.
on actions/index.js:

<code>
import {
  GET_ARTICLES,
  GET_BLACKGUARD_POSTS,
  GET_PUBLICACIONES,
  GET_POSTS,
  ERROR_GLOBAL,
  SUCCESS_GLOBAL,
  CLEAR_NOTIFICATION,
} from '../types'

[...]

export const errorGlobal = (msg) => ({
type: ERROR_GLOBAL,
payload: msg
});

export const successGlobal = (msg) => ({
type: SUCCESS_GLOBAL,
payload: msg
});

export const clearNotification = () => {
return (dispatch) => {
dispatch({
type: CLEAR_NOTIFICATION
})
}
}
</code>

on store/types:

<code>
export const ERROR_GLOBAL = 'error_global';
export const SUCCESS_GLOBAL = 'success_global';
export const CLEAR_NOTIFICATION = 'clear_notification'
</code>

Import it on the reducer notification_reducer.js:

<code>

import { ERROR_GLOBAL, SUCCESS_GLOBAL, CLEAR_NOTIFICATION } from '../types'

export default function notificationReducer(state = {}, action) {
switch (action.type) {
case ERROR_GLOBAL:
return {
...state,
error: true,
msg: action.payload,
}
case SUCCESS_GLOBAL:
return { ...state, success: true, msg: action.payload }
case CLEAR_NOTIFICATION:
return {}
default:
return state
}
}

</code>

now I can use on article/everything else actions:

on article_actions.js:

<code>
    } catch (error) {
      dispatch(articles.errorGlobal('db error, try again'))
    }
</code>

redux now detects the error, now it's time to make it visible, on header.js:

<code>
import React, { useEffect } from 'react'
import { Navbar, Container } from 'react-bootstrap'
import Logo from '../logo/logo'
/* import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher'
import { useTranslation } from 'react-i18next'
import styles from '../../styles/header.module.css'
 */
/* notifications! */
import { useSelector, useDispatch } from 'react-redux'
import { clearNotification } from '../../store/actions/index'
import { showToast } from '../../utils/tools'

import { Link } from 'react-router-dom'
import SideDrawer from './sideNavigation'

const Header = (prop) => {
// localization
/_ const [t] = useTranslation() _/

const notifications = useSelector((state) => state.notifications)
const dispatch = useDispatch()

useEffect(() => {
if (notifications && notifications.error) {
const msg = notifications.msg ? notifications.msg : 'Error'
showToast('ERROR', msg)
dispatch(clearNotification())
}
if (notifications && notifications.success) {
const msg = notifications.msg ? notifications.msg : 'Error'
showToast('SUCCESS', msg)
dispatch(clearNotification())
}
}, [notifications, dispatch])

return (

<div className='navigation'>
<div className='header'>
<Container className='px-4'>
<Navbar className='d-flex justify-content-between'>
<Navbar.Brand>
<Logo />
</Navbar.Brand>
<div>
<ul className='navbar-nav'>
<li className='nav-item'>
<Link className='navbar-link' to='/blog'>
blog
</Link>
</li>
<li className='nav-item'>
<Link className='navbar-link' to='/#projects'>
{/_ {t('header.projects')} _/}
projects
</Link>
</li>
<li className='nav-item'>
<Link className='navbar-link' to='/#contact'>
{/_ {t('header.contactme')} _/}
contact
</Link>
</li>
<li className='nav-item'>
{/_ <LanguageSwitcher /> _/}
language switcher here
</li>
</ul>
</div>
<SideDrawer />
</Navbar>
</Container>
</div>
</div>
)
}
/_ NOTE withRouter does not exists anymore;
export 'withRouter' (imported as 'withRouter') was not found in 'react-router-dom'
instead, import ??? _/
export default Header

</code>

## login/register form!

create comps/auth/index.js:

<code>
import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Form, Button } from 'react-bootstrap'

const Auth = (props) => {
const [register, setRegister] = useState(false)

const formik = useFormik({
initialValues: { email: '', password: '' },
validationSchema: Yup.object({
email: Yup.string()
.required('Sorry the email is required')
.email('This is not a valid email'),
password: Yup.string().required('Sorry the password is required'),
}),
onSubmit: (values, { resetForm }) => {
console.log(values)
},
})
const errorHelper = (formik, values) => ({
error: formik.errors[values] && formik.touched[values] ? true : false,
helperText:
formik.errors[values] && formik.touched[values]
? formik.errors[values]
: null,
})

return (

<div>
<h1>auth!</h1>
<div className='input-group mb-3'>
<Form onSubmit={formik.handleSubmit}>
<Form.Group className='mb-3' controlId='formBasicEmail'>
<Form.Label>Email address</Form.Label>
<Form.Control
type='email'
placeholder='Enter email'
{...formik.getFieldProps('email')}
{...errorHelper(formik, 'email')}
/>
</Form.Group>

          <Form.Group className='mb-3' controlId='formBasicPassword'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Password'
              {...formik.getFieldProps('password')}
              {...errorHelper(formik, 'password')}
            />
          </Form.Group>

          <Button variant='primary' type='submit'>
            {register ? 'Register' : 'Login'}
          </Button>
          <Button
            className='mt-3'
            variant='outlined'
            color='secondary'
            size='small'
            onClick={() => setRegister(!register)}
          >
            Want to {!register ? 'Register' : 'Login'} ?
          </Button>
        </Form>
      </div>
    </div>

)
}

export default Auth

</code>

register it on routes.js.

## register users!

on actions/index.js:
<code>
export const authUser = (user) => ({
type: AUTH_USER,
payload: user
})

</code>
on store/types.js:

<code>

/_ auth user _/

export const AUTH_USER = 'auth_user'
</code>

created actions/user_actions.js:

<code>
import * as users from './index'
import axios from 'axios'

axios.defaults.headers.post['Content-Type'] = 'application/json'

export const registerUser = (values) => {
return async (dispatch) => {
try {
const user = await axios.post(`/api/users/register`, {
email: values.email,
password: values.password,
})

      dispatch(users.authUser({ data: user.data, auth: true }))
      dispatch(
        users.successGlobal(
          'Registration successful. Check your email and validate your account.'
        )
      )
    } catch (error) {
      console.log(error.response.data.message)
      dispatch(users.errorGlobal('error while registering user'))
    }

}
}

</code>

on reducers/users_reducers.js:

<code>
import { AUTH_USER } from '../types'

let DEFAULT_USER_STATE = {
data: {
\_id: null,
email: null,
firstname: null,
lastname: null,
age: null,
role: null,
},
auth: null,
}

export default function usersReducer(state = { DEFAULT_USER_STATE }, action) {
switch (action.type) {
case AUTH_USER:
return {
...state,
data: {
...state.data,
...action.payload.data,
},
auth: action.payload.auth,
}
default:
return state
}
}

</code>

on auth/index.js:

<code>
import React, { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Form, Button } from 'react-bootstrap'

import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser } from '../../store/actions/user_actions'

const Auth = (props) => {
const navigate = useNavigate()
const [register, setRegister] = useState(false)
const notifications = useSelector((state) => state.notifications)
const dispatch = useDispatch()

const formik = useFormik({
initialValues: { email: '', password: '' },
validationSchema: Yup.object({
email: Yup.string()
.required('Sorry the email is required')
.email('This is not a valid email'),
password: Yup.string().required('Sorry the password is required'),
}),
onSubmit: (values, { resetForm }) => {
console.log(values)
handleSubmit(values)
},
})

const handleSubmit = (values) => {
if (register) {
dispatch(registerUser(values))
} else {
// login
}
}

const errorHelper = (formik, values) => ({
error: formik.errors[values] && formik.touched[values] ? true : false,
helperText:
formik.errors[values] && formik.touched[values]
? formik.errors[values]
: null,
})

useEffect(() => {
if (notifications && notifications.success) {
navigate('/')
}
}, [notifications, navigate])

return (

<div>
<h1>auth!</h1>
<div className='input-group mb-3'>
<Form onSubmit={formik.handleSubmit}>
<Form.Group className='mb-3' controlId='formBasicEmail'>
<Form.Label>Email address</Form.Label>
<Form.Control
type='email'
placeholder='Enter email'
{...formik.getFieldProps('email')}
{...errorHelper(formik, 'email')}
/>
</Form.Group>

          <Form.Group className='mb-3' controlId='formBasicPassword'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Password'
              {...formik.getFieldProps('password')}
              {...errorHelper(formik, 'password')}
            />
          </Form.Group>

          <Button variant='primary' type='submit'>
            {register ? 'Register' : 'Login'}
          </Button>
          <Button
            variant='secondary'
            size='small'
            onClick={() => setRegister(!register)}
          >
            Want to {!register ? 'Register' : 'Login'} ?
          </Button>
        </Form>
      </div>
    </div>

)
}

export default Auth

</code>

Remember, props.history does not work anymore. use useNavigate() from 'react-router-dom' instead!

## sign in users

on user_actions.js:

<code>

export const signInUser = (values) => {
return async (dispatch) => {
try {
const user = await axios.post(`/api/users/signin`, {
email: values.email,
password: values.password,
})

      dispatch(users.authUser({ data: user.data, auth: true }))
      dispatch(
        users.successGlobal(
          'Welcome back.'
        )
      )
    } catch (error) {
      console.log(error.response.data.message)
      dispatch(users.errorGlobal('error while login'))
    }

}
}

</code>

on auth/index.js:

<code>
import * as users from './index'
import axios from 'axios'

axios.defaults.headers.post['Content-Type'] = 'application/json'

export const registerUser = (values) => {
return async (dispatch) => {
try {
const user = await axios.post(`/api/users/register`, {
email: values.email,
password: values.password,
})

      dispatch(users.authUser({ data: user.data, auth: true }))
      dispatch(
        users.successGlobal(
          'Registration successful. Check your email and validate your account.'
        )
      )
    } catch (error) {
      console.log(error.response.data.message)
      dispatch(
        users.errorGlobal(
          'error while registering: ',
          error.response.data.message
        )
      )
    }

}
}

export const signInUser = (values) => {
return async (dispatch) => {
try {
const user = await axios.post(`/api/users/signin`, {
email: values.email,
password: values.password,
})

      dispatch(users.authUser({ data: user.data, auth: true }))
      dispatch(users.successGlobal('Welcome back.'))
    } catch (error) {
      console.log(error.response.data.message)
      dispatch(
        users.errorGlobal('error while logging: ', error.response.data.message)
      )
    }

}
}

</code>

## auto sign in for users

on users_Actions.js:

<code>
import { getAuthHeader,removeTokenCookie } from '../../utils/tools';
[...]
export const isAuthUser = () => {
return async(dispatch) =>{
try{
const user = await axios.get(`/api/users/isauth`,getAuthHeader);
dispatch(users.authUser({data: user.data, auth: true }))
} catch(error){
dispatch(users.authUser({data: {}, auth: false }))
}
}
}
</code>

on utils/tools.js:

<code>
import cookie from 'react-cookies';
[...]
export const getTokenCookie = () => cookie.load('x-access-token');
export const removeTokenCookie = () => cookie.remove('x-access-token');
export const getAuthHeader = { headers: { 'x-access-token':getTokenCookie() }}
</code>

on users_reducer.js:

<code>
import {
    AUTH_USER
} from '../types';

let DEFAULT_USER_STATE = {
data: {
\_id: null,
email: null,
firstname:null,
lastname:null,
age:null,
role:null
},
auth:null
}

export default function usersReducer(state=DEFAULT_USER_STATE,action){
switch(action.type){
case AUTH_USER:
return { ...state,
data: { ...state.data, ...action.payload.data},
auth: action.payload.auth
}
default:
return state
}
}
</code>

on routes.js:

<code>
import React, { useEffect, useState } from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import { isAuthUser } from './store/actions/user_actions'

/_ pages _/
import Home from './components/pages/index'
import Tmik from './components/pages/tmik'
import BlogPage from './components/pages/blog'
import BlackguardIndex from './components/pages/blackguardBlog'
import BlackguardBlogPage from './components/pages/blackguardBlog'
import Layout from './components/layout/layout'

import Auth from './components/auth/index'

const RoutesFile = () => {
const [loading, setLoading] = useState(true)
const dispatch = useDispatch()
const users = useSelector((state) => state.users)

useEffect(() => {
dispatch(isAuthUser())
}, [dispatch])

useEffect(() => {
if (users.auth !== null) {
setLoading(false)
}
}, [users])
return (
<BrowserRouter>
<Layout>
<Routes>
<Route path='/' element={<Home />} />
<Route path='/auth' element={<Auth />} />
<Route path='/blackguard' element={<BlackguardIndex />} />
<Route path='/blackguard_blog' element={<BlackguardBlogPage />} />
<Route path='/tmik' element={<Tmik />} />
<Route path='/blog' element={<BlogPage />} />
</Routes>
</Layout>
</BrowserRouter>
)
}

export default RoutesFile

</code>

## loader:

create utils/loader.js:

<code>
import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

const Loader = () => (

<div className="root_loader">
<CircularProgress/>
</div>
)

export default Loader;

</code>

## logout users:

on users_actions.js:

<code>
export const signOut= () => {
    return async (dispatch) => {
        removeTokenCookie();
        dispatch(users.signOut())
    }
}
</code>

on actions/index.js:

<code>
import {
  GET_ARTICLES,
  GET_BLACKGUARD_POSTS,
  GET_PUBLICACIONES,
  GET_POSTS,
  ERROR_GLOBAL,
  SUCCESS_GLOBAL,
  CLEAR_NOTIFICATION,
  AUTH_USER,
  SIGN_OUT,
} from '../types'

export const signOut = () => ({
type:SIGN_OUT
})

</code>

on users:reducer.js:

<code>
import { AUTH_USER, SIGN_OUT } from '../types'

export default function usersReducer(state=DEFAULT_USER_STATE,action){
switch(action.type){
case AUTH_USER:
return { ...state,
data: { ...state.data, ...action.payload.data},
auth: action.payload.auth
}
case SIGN_OUT:
return {...state,
data: {...DEFAULT_USER_STATE.data},
auth: false
}
default:
return state
}
}
</code>

on store/types.js:

<code>
export const SIGN_OUT = 'sign_out'
</code>

on header.js:

<code>
import { signOut } from '../../store/actions/user_actions'
import { useNavigate } from 'react-router-dom'
[...]
const navigate = useNavigate()

const signOutUser = () => {
dispatch(signOut())
navigate('/')
}
[...]

<SideDrawer signOutUser={signOutUser}/>
</code>

on sideNavigation.js:

<code>
 <ListItem
              button
              onClick={() => {
                signOutUser()
                setState(false)
              }}
            >
              <ListItemText primary='Sign out' />
            </ListItem>
</code>

## admin layout!

create components/dashboard/index.js!

<code>
import React from 'react'
import AdminLayout from '../../components/layout/adminLayout'

const Dashboard = () => {
return <AdminLayout section='Dashboard'>dashboard</AdminLayout>
}

export default Dashboard

</code>

created dashboard/articles/index.js:<

<code>
import React from 'react';
import AdminLayout from '../../../components/layout/adminLayout'

const Articles = () => {
return(
<AdminLayout section="Articles">
Articles
</AdminLayout>
)
}

export default Articles;

</code>

created dashboard/profile/index.js:

<code>
import React from 'react';
import AdminLayout from '../../../components/layout/adminLayout'

const Profile = () => {
return(
<AdminLayout section="Profile">
profile
</AdminLayout>
)
}

export default Profile;
</code>

import it to routes.js:

<code>
<Route path='/dashboard' element={<Dashboard />} />
</code>

creating and using layout/adminlayout.js:

<code>
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import {
List,
ListItem,
ListItemText
} from '@material-ui/core';

const AdminLayout = (props) => {
return(
<>

<div className="row adminLayout">
<nav className="col-md-2 d-none d-md-block sidebar">
<div>
<List>
<ListItem button component={RouterLink} to="/dashboard">
<ListItemText primary="Dashboard"/>
</ListItem>
<ListItem button component={RouterLink} to="/dashboard/profile">
<ListItemText primary="Profile"/>
</ListItem>
</List>
</div>
</nav>

                <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
                    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
                        <h1 className="h2">{props.section}</h1>
                    </div>
                        {props.children}
                </main>
            </div>
        </>
    )

}

export default AdminLayout;
</code>

Due to my layout config, whose comp includes header and footer, I am not using redux to differentiate when to use one layout or the other. To do this, use Redux:

reducers/site_reducer.js:

<code>
import { SITE_LAYOUT } from '../types'

export default function siteReducer(state = {}, action) {
switch (action.type) {
case SITE_LAYOUT:
return { ...state, layout: action.payload }
default:
return state
}
}

</code>

actions/site_actions.js:

<code>

import \* as site from './index';

export const appLayout = (layout) => {
return (dispatch) =>{
dispatch(site.appLayout(layout))
};
}
</code>

on actions/index.js:

<code>
import {
  GET_ARTICLES,
  GET_BLACKGUARD_POSTS,
  GET_PUBLICACIONES,
  GET_POSTS,
  ERROR_GLOBAL,
  SUCCESS_GLOBAL,
  CLEAR_NOTIFICATION,
  AUTH_USER,
  SIGN_OUT,
  SITE_LAYOUT
} from '../types'

[...]

/_ layouts _/

export const appLayout = (layout) => ({
type: SITE_LAYOUT,
payload: layout
})

</code>

on store/types.js:

<code>
/* site layouts */

export const SITE_LAYOUT = 'site_layout'
</code>

for future references, I took these notes and create those comps. But I am not going to use them atm.

## ROUTE GUARD

create comps/authGuard.js: THIS DOES NOT WORK

<code>
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function authguard(ComposedComponent, roleCheck = false) {
const AuthenticationCheck = (props) => {
const navigate = useNavigate()
const [isAuth, setIsAuth] = useState(false)
const users = useSelector((state) => state.users)

    useEffect(() => {
      if (!users.auth) {
        navigate('/')
      } else {
        if (roleCheck && users.data.role === 'user') {
          navigate('/dashboard')
        } else {
          setIsAuth(true)
        }
      }
    }, [props, users])

    if (!isAuth) {
      return <div className='main_loader'>loading</div>
    } else {
      return <ComposedComponent {...props} />
    }

}
return AuthenticationCheck
}

</code>

This is my solution:
created auth/PrivateRoute:

<code>
import React from 'react'
import { useSelector } from 'react-redux'
import { Route, Navigate } from 'react-router-dom'

const PrivateRoute = ({ children }) => {
const loggedIn = useSelector((state) => state.users.auth)
return loggedIn === 'true' ? children : <Navigate to='/' replace />
}

export default PrivateRoute

</code>

update routes.js:

<code>
import React, { useEffect, useState } from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import { isAuthUser } from './store/actions/user_actions'

import Loader from './utils/loader'

import Header from './components/navigation/header'
import Footer from './components/navigation/footer'

/_ pages _/
import Home from './components/pages/index'
import Tmik from './components/pages/tmik'
import BlogPage from './components/pages/blog'
import BlackguardIndex from './components/pages/blackguardIndex'
import BlackguardBlogPage from './components/pages/blackguardBlog'

import Layout from './components/layout/layout'

/_ dashboard _/
import Dashboard from './components/dashboard/index'
import Profile from './components/dashboard/profile'
import Articles from './components/dashboard/articles'

import PrivateRoute from './components/auth/PrivateRoute'

import Auth from './components/auth/index'

const RoutesFile = () => {
const [loading, setLoading] = useState(true)
const dispatch = useDispatch()
const users = useSelector((state) => state.users)

useEffect(() => {
dispatch(isAuthUser())
}, [dispatch])

useEffect(() => {
if (users.auth !== null) {
setLoading(false)
}
}, [users])
return (
<BrowserRouter>

<Header />
{loading ? (
<>
<Loader />
</>
) : (
<Layout>
<Routes>
<Route path='/' element={<Home />} />
<Route path='/auth' element={<Auth />} />
<Route path='/blackguard' element={<BlackguardIndex />} />
<Route path='/blackguard_blog' element={<BlackguardBlogPage />} />
<Route path='/tmik' element={<Tmik />} />
<Route path='/blog' element={<BlogPage />} />
<Route
path='/dashboard'
element={
<PrivateRoute>
<Dashboard />
</PrivateRoute>
}
/>
<Route
path='/dashboard/articles'
element={
<PrivateRoute>
<Articles />
</PrivateRoute>
}
/>
<Route
path='/dashboard/profile'
element={
<PrivateRoute>
<Profile />
</PrivateRoute>
}
/>
</Routes>
</Layout>
)}
<Footer />
</BrowserRouter>
)
}

export default RoutesFile

</code>

## guarding nav links:

on headers.js:

<code>
const users = useSelector(state => state.users)
[...]
            <SideNavigation users={users} signOutUser={signOutUser} />

</code>

on sideNavigation.js:

<code>
import React, { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'

import {
Drawer,
List,
Divider,
ListItem,
ListItemText,
} from '@material-ui/core'

/_ material-ui styles! _/
import { makeStyles } from '@material-ui/core/styles'

import DehazeIcon from '@material-ui/icons/Dehaze'

const useStyles = makeStyles({
paper: {
background: 'black',
},
})

const SideNavigation = ({ signOutUser, users }) => {
const [state, setState] = useState(false)
const classes = useStyles()

return (
<>

<div className='sideNavigation'>
<DehazeIcon className='drawer_btn' onClick={() => setState(true)} />
<Drawer
anchor={'right'}
open={state}
onClose={() => setState(false)}
classes={{ paper: classes.paper }} >
<Divider />
<List>
{/_ <ListItem
button
component={RouterLink}
to='/'
onClick={() => setState(false)} >
<ListItemText
                className='sideNavigation__list-item'
                primary='index here'
              />
</ListItem> _/}
<ListItem
button
component={RouterLink}
to='/blog'
onClick={() => setState(false)} >
<ListItemText
                className='sideNavigation__list-item'
                primary='blog'
              />
</ListItem>
<ListItem
button
component={RouterLink}
to='/projects'
onClick={() => setState(false)} >
<ListItemText
                className='sideNavigation__list-item'
                primary='projects'
              />
</ListItem>
<ListItem
button
component={RouterLink}
to='/contact'
onClick={() => setState(false)} >
<ListItemText
                className='sideNavigation__list-item'
                primary='contact'
              />
</ListItem>
<ListItem
button
component={RouterLink}
to='/blackguard'
onClick={() => setState(false)} >
<ListItemText
                className='sideNavigation__list-item'
                primary='blackguard'
              />
</ListItem>
<ListItem
button
component={RouterLink}
to='/blackguard_blog'
onClick={() => setState(false)} >
<ListItemText
                className='sideNavigation__list-item'
                primary='blackguard blog'
              />
</ListItem>
<ListItem
button
component={RouterLink}
to='/tmik'
onClick={() => setState(false)} >
<ListItemText
                className='sideNavigation__list-item'
                primary='tmik'
              />
</ListItem>

            {users.auth ? (
              <ListItem
                button
                onClick={() => {
                  signOutUser()
                  setState(false)
                }}
              >
                <ListItemText
                  className='sideNavigation__list-item'
                  primary='Sign out'
                />
              </ListItem>
            ) : (
              <ListItem
                button
                component={RouterLink}
                to='/auth'
                onClick={() => setState(false)}
              >
                <ListItemText
                  className='sideNavigation__list-item'
                  primary='Sign in'
                />
              </ListItem>
            )}

            <ListItem button onClick={() => setState(false)}>
              <ListItemText
                className='sideNavigation__list-item'
                primary='es/en'
              />
            </ListItem>
          </List>
          <Divider />
          {users.auth ? (
            <List>
              <ListItem
                button
                component={RouterLink}
                to='/dashboard'
                onClick={() => setState(false)}
              >
                <ListItemText
                  className='sideNavigation__list-item'
                  primary='Dashboard'
                />
              </ListItem>
            </List>
          ) : null}
        </Drawer>
      </div>
    </>

)
}

export default SideNavigation

</code>

same in adminlayout.js:

<code>
import React, { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { List, ListItem, ListItemText } from '@material-ui/core'

const AdminLayout = (props) => {
const user = useSelector((state) => state.users)
return (
<>

<div className='row adminLayout'>
<nav className='col-md-2 d-none d-md-block sidebar'>
<div>
<List>
<ListItem button component={RouterLink} to='/dashboard'>
<ListItemText primary='Dashboard' />
</ListItem>
<ListItem button component={RouterLink} to='/dashboard/profile'>
<ListItemText primary='Profile' />
</ListItem>
{user.data.role === 'admin' ? (
<ListItem
                  button
                  component={RouterLink}
                  to='/dashboard/articles'
                >
<ListItemText primary='Articles' />
</ListItem>
) : null}
</List>
</div>
</nav>

        <main role='main' className='col-md-9 ml-sm-auto col-lg-10 pt-3 px-4'>
          <div className='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom'>
            <h1 className='h2'>{props.section}</h1>
          </div>
          {props.children}
        </main>
      </div>
    </>

)
}

export default AdminLayout

</code>

created auth/preventAuthRoute.js:

<code>
import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const PreventAuthRoute = (props) => {
const users = useSelector((state) => state.users)

return <>{users.auth ? <Navigate to='/dashboard' /> : props.children}</>
}

export default PreventAuthRoute

</code>

on auth/index.js:

<code>
import React, { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Form, Button } from 'react-bootstrap'

import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser, signInUser } from '../../store/actions/user_actions'

import PreventAuthRoute from './preventAuthRoute'

const Auth = (props) => {
const navigate = useNavigate()
const [register, setRegister] = useState(false)
const notifications = useSelector((state) => state.notifications)
const dispatch = useDispatch()

const formik = useFormik({
initialValues: { email: '', password: '' },
validationSchema: Yup.object({
email: Yup.string()
.required('Sorry the email is required')
.email('This is not a valid email'),
password: Yup.string().required('Sorry the password is required'),
}),
onSubmit: (values, { resetForm }) => {
console.log(values)
handleSubmit(values)
},
})

const handleSubmit = (values) => {
if (register) {
dispatch(registerUser(values))
} else {
dispatch(signInUser(values))
}
}

const errorHelper = (formik, values) => ({
error: formik.errors[values] && formik.touched[values] ? true : false,
helperText:
formik.errors[values] && formik.touched[values]
? formik.errors[values]
: null,
})

useEffect(() => {
if (notifications && notifications.success) {
navigate('/')
}
}, [notifications, navigate])

return (

<div>
<PreventAuthRoute>
<h1>auth!</h1>
<div className='input-group mb-3'>
<Form onSubmit={formik.handleSubmit}>
<Form.Group className='mb-3' controlId='formBasicEmail'>
<Form.Label>Email address</Form.Label>
<Form.Control
type='email'
placeholder='Enter email'
{...formik.getFieldProps('email')}
{...errorHelper(formik, 'email')}
/>
</Form.Group>

            <Form.Group className='mb-3' controlId='formBasicPassword'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Password'
                {...formik.getFieldProps('password')}
                {...errorHelper(formik, 'password')}
              />
            </Form.Group>

            <Button variant='primary' type='submit'>
              {register ? 'Register' : 'Login'}
            </Button>
            <Button
              variant='secondary'
              size='small'
              onClick={() => setRegister(!register)}
            >
              Want to {!register ? 'Register' : 'Login'} ?
            </Button>
          </Form>
        </div>
      </PreventAuthRoute>
    </div>

)
}

export default Auth

</code>

## hotfix for deleting cookies when signing out!

on utils/tools.js:

<code>
replace this: 
export const getTokenCookie = () => cookie.load('x-access-token')
export const removeTokenCookie = () => cookie.remove('x-access-token')
export const getAuthHeader = { headers: { 'x-access-token': getTokenCookie() } }

with this:

export const getTokenCookie = () => cookie.load('x-access-token');
export const removeTokenCookie = () => cookie.remove('x-access-token', {path:'/'});
export const getAuthHeader = () => {
return { headers: { 'x-access-token':getTokenCookie() }}
}
</code>

on users_actions.js:

<code>
import * as users from './index'
import axios from 'axios'
import {
  getAuthHeader,
  removeTokenCookie,
  getTokenCookie,
} from '../../utils/tools'

axios.defaults.headers.post['Content-Type'] = 'application/json'

export const registerUser = (values) => {
return async (dispatch) => {
try {
const user = await axios.post(`/api/users/register`, {
email: values.email,
password: values.password,
})

      dispatch(users.authUser({ data: user.data, auth: true }))
      dispatch(
        users.successGlobal(
          'Registration successful. Check your email and validate your account.'
        )
      )
    } catch (error) {
      console.log(error.response.data.message)
      dispatch(
        users.errorGlobal(
          'error while registering: ',
          error.response.data.message
        )
      )
    }

}
}

export const signInUser = (values) => {
return async (dispatch) => {
try {
const user = await axios.post(`/api/users/signin`, {
email: values.email,
password: values.password,
})

      dispatch(users.authUser({ data: user.data, auth: true }))
      dispatch(users.successGlobal('Welcome back.'))
    } catch (error) {
      console.log(error.response.data.message)
      dispatch(
        users.errorGlobal('error while logging: ', error.response.data.message)
      )
    }

}
}

export const isAuthUser = () => {
return async (dispatch) => {
try {
if (!getTokenCookie()) {
throw new Error()
}

      const user = await axios.get(`/api/users/isauth`, getAuthHeader())
      dispatch(users.authUser({ data: user.data, auth: true }))
    } catch (error) {
      dispatch(users.authUser({ data: {}, auth: false }))
    }

}
}

export const signOut = () => {
return async (dispatch) => {
removeTokenCookie()
dispatch(users.signOut())
}
}

</code>

## creating the article section:

creating comps/articles/article/index.js:

<code>

import React, { useEffect } from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { getArticle } from '../../../store/actions/article_actions';
import Loader from '../../../utils/loader';

const Article = (props) => {
const { current } = useSelector( state => state.articles );
const dispatch = useDispatch();

    useEffect(()=>{
        /// props.match.params.id
        dispatch(getArticle(props.match.params.id))
    },[dispatch, props.match.params])


    return(
        <>
         { current ?
            <div className="article_container">
                <div
                    style={{
                        background:`url(https://picsum.photos/1920/1080)`
                    }}
                    className="image"
                >
                </div>
                <h1>{current.title}</h1>
                <div className="mt-3 content">
                    <div dangerouslySetInnerHTML={
                        {__html: current.content}
                    }>
                    </div>
                </div>

            </div>
        :
            <Loader/>
        }

        </>
    )

}

export default Article;

</code>

on routes.js:

<code>
/* articles section */

import Article from './components/articles/article/index'
[...]
<Route path="/article/:id" component={Article}/>
</code>

on article_actions.js:

<code>
export const getArticle = (id) => {
    return async (dispatch)=>{
        try{
            const request = await axios.get(`/api/articles/get_byid/${id}`);
            dispatch(articles.getArticle(request.data[0]))
        } catch(error){
            dispatch(articles.errorGlobal(error.response.data.message))
        }
    }
}
</code>

on actions/index.js:

<code>
import {
  GET_ARTICLES,
  GET_ARTICLE,
  GET_BLACKGUARD_POSTS,
  GET_PUBLICACIONES,
  GET_POSTS,
  ERROR_GLOBAL,
  SUCCESS_GLOBAL,
  CLEAR_NOTIFICATION,
  AUTH_USER,
  SIGN_OUT,
  SITE_LAYOUT,
} from '../types'

[...]

export const getArticle = (article) => ({
type: GET_ARTICLE,
payload: article
})
</code>

on store/types.js:

<code>

</code>

on articles_reducer.js:

<code>
import {
    GET_ARTICLES,
    GET_ARTICLE
} from '../types';

export default function articleReducer(state={},action){
switch(action.type){
case GET_ARTICLES:
return { ...state, articles:action.payload }
case GET_ARTICLE:
return {...state, current: action.payload }
default:
return state
}
}
</code>

## adding new articles:

create dashboard/articles/add.js:
this will be a form to post new articles

<code>
import React, { useState, useEffect, useRef } from 'react'
import AdminLayout from '../../../components/layout/adminLayout'
import { useFormik, FieldArray, FormikProvider } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { validation, formValues } from './validationSchema'

import {
TextField,
Button,
Divider,
Chip,
Paper,
InputBase,
IconButton,
Select,
MenuItem,
FormControl,
FormHelperText,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'

const AddArticle = (props) => {
const formik = useFormik({
enableReinitialize: true,
initialValues: formValues,
validationSchema: validation,
onSubmit: (values, { resetForm }) => {
console.log(values)
},
})

const errorHelper = (formik, values) => ({
error: formik.errors[values] && formik.touched[values] ? true : false,
helperText:
formik.errors[values] && formik.touched[values]
? formik.errors[values]
: null,
})

return (
<AdminLayout section='Add article'>

<form className='mt-3 article_form' onSubmit={formik.handleSubmit}>
<div className='form-group'>
<TextField
style={{ width: '100%' }}
name='title'
label='Enter a title'
variant='outlined'
{...formik.getFieldProps('title')}
{...errorHelper(formik, 'title')}
/>
</div>

        <div className='form-group'>
          <TextField
            style={{ width: '100%' }}
            name='excerpt'
            label='Enter an excerpt'
            variant='outlined'
            {...formik.getFieldProps('excerpt')}
            {...errorHelper(formik, 'excerpt')}
            multiline
            rows={4}
          />
        </div>

        <Divider className='mt-3 mb-3' />
        <h5>Movie data and score</h5>
        <div className='form-group'>
          <TextField
            style={{ width: '100%' }}
            name='score'
            label='Enter a score'
            variant='outlined'
            {...formik.getFieldProps('score')}
            {...errorHelper(formik, 'score')}
          />
        </div>

        <div className='form-group'>
          <TextField
            style={{ width: '100%' }}
            name='director'
            label='Enter a director'
            variant='outlined'
            {...formik.getFieldProps('director')}
            {...errorHelper(formik, 'director')}
          />
        </div>

        <FormControl variant='outlined'>
          <h5>Select a status</h5>
          <Select
            name='status'
            {...formik.getFieldProps('status')}
            error={formik.errors.status && formik.touched.status ? true : false}
          >
            <MenuItem value=''>
              <em>None</em>
            </MenuItem>
            <MenuItem value='draft'>Draft</MenuItem>
            <MenuItem value='public'>Public</MenuItem>
          </Select>
          {formik.errors.status && formik.touched.status ? (
            <FormHelperText error={true}>{formik.errors.status}</FormHelperText>
          ) : null}
        </FormControl>

        <Divider className='mt-3 mb-3' />
        <Button
          variant='contained'
          color='primary'
          type='submit'
          // disabled={false}
        >
          Add article
        </Button>
      </form>
    </AdminLayout>

)
}

export default AddArticle

</code>

additionally, a validationSchema.js:

<code>

import \* as Yup from 'yup'

export const formValues = {
title: '',
content: '',
excerpt: '',
score: '',
director: '',
actors: [],
status: 'draft',
}

export const validation = () =>
Yup.object({
title: Yup.string().required('Sorry the title is required'),
content: Yup.string()
.required('Sorry the content is required')
.min(50, 'That is it ? ...write some more'),
excerpt: Yup.string()
.required('Sorry the excerpt is required')
.max(500, 'Sorry its 500 max'),
score: Yup.number()
.required('Sorry the score is required')
.min(0, '0 is the minimum')
.max(100, '100 is the max'),
director: Yup.string().required('Sorry the director is required'),
actors: Yup.array().required('Must have actors').min(3, 'Minimum is 3'),
status: Yup.string().required('Sorry the status is required'),
})

</code>

in my version I am using bootstrap with FieldArray from material ui
todo! replace FieldArray from material ui with bootstrap

<code>
import React, { useState, useEffect, useRef } from 'react'
import AdminLayout from '../../../components/layout/adminLayout'
import { useFormik, FieldArray, FormikProvider } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { validation, formValues } from './validationSchema'
import { Form, Button } from 'react-bootstrap'

import {
TextField,
Divider,
Chip,
Paper,
InputBase,
IconButton,
MenuItem,
FormControl,
FormHelperText,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'

const AddArticle = (props) => {
const actorsValue = useRef('')
const formik = useFormik({
enableReinitialize: true,
initialValues: formValues,
validationSchema: validation,
onSubmit: (values, { resetForm }) => {
console.log(values)
},
})

const errorHelper = (formik, values) => ({
error: formik.errors[values] && formik.touched[values] ? true : false,
helperText:
formik.errors[values] && formik.touched[values]
? formik.errors[values]
: null,
})

return (
<AdminLayout section='Add article'>

<Form className='mt-3 article_form' onSubmit={formik.handleSubmit}>
<div className='form-group'>
<Form.Label>Enter a title</Form.Label>
<Form.Control
style={{ width: '100%' }}
name='title'
label='Enter a title'
variant='standard'
{...formik.getFieldProps('title')}
{...errorHelper(formik, 'title')}
/>
</div>

        <div className='form-group'>
          <Form.Label>Enter an excerpt</Form.Label>
          <Form.Control
            style={{ width: '100%' }}
            name='excerpt'
            label='Enter an excerpt'
            variant='outlined'
            {...formik.getFieldProps('excerpt')}
            {...errorHelper(formik, 'excerpt')}
            multiline
            rows={4}
          />
        </div>

        <Divider className='mt-3 mb-3' />
        <Form.Label>Enter a score</Form.Label>
        <div className='form-group'>
          <Form.Control
            style={{ width: '100%' }}
            name='score'
            label='Enter a score'
            variant='outlined'
            {...formik.getFieldProps('score')}
            {...errorHelper(formik, 'score')}
          />
        </div>

        <FormikProvider value={formik}>
          <h5>Add the actors:</h5>
          <FieldArray
            name='actors'
            render={(arrayhelpers) => (
              <div>
                <Paper className='actors_form'>
                  <InputBase
                    inputRef={actorsValue}
                    className='input'
                    placeholder='Add actor name here'
                  />
                  <IconButton
                    onClick={() => {
                      arrayhelpers.push(actorsValue.current.value)
                      actorsValue.current.value = ''
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Paper>
                {formik.errors.actors && formik.touched.actors ? (
                  <FormHelperText error={true}>
                    {formik.errors.actors}
                  </FormHelperText>
                ) : null}

                <div className='chip_container'>
                  {formik.values.actors.map((actor, index) => (
                    <div key={actor}>
                      <Chip
                        label={`${actor}`}
                        color='primary'
                        onDelete={() => arrayhelpers.remove(index)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          />
        </FormikProvider>

        <div className='form-group'>
          <Form.Label>Enter a director</Form.Label>
          <Form.Control
            style={{ width: '100%' }}
            name='director'
            label='Enter a director'
            variant='outlined'
            {...formik.getFieldProps('director')}
            {...errorHelper(formik, 'director')}
          />
        </div>

        <Form.Group variant='outlined'>
          <h5>Select a status</h5>
          <Form.Label>Select a Status</Form.Label>
          <Form.Select
            name='status'
            {...formik.getFieldProps('status')}
            error={formik.errors.status && formik.touched.status ? true : false}
          >
            <option value=''>
              <em>None</em>
            </option>
            <option value='draft'>Draft</option>
            <option value='public'>Public</option>
          </Form.Select>
          {formik.errors.status && formik.touched.status ? (
            <FormHelperText error={true}>{formik.errors.status}</FormHelperText>
          ) : null}
        </Form.Group>

        <Divider className='mt-3 mb-3' />
        <Button
          variant='primary'
          color='primary'
          type='submit'
          // disabled={false}
        >
          Add article
        </Button>
      </Form>
    </AdminLayout>

)
}

export default AddArticle

</code>

The problem is on validationSchema, just comment whatever is not in the add.js page yet and you're good to go, regardless of which css framework you're using. I prefer to use bootstrap as much as I want.

## WYSIWYG

create utils/forms/wysiwyg.js:

<code>

import React,{ useState, useEffect} from 'react'

//// wysiwyg
import { EditorState, ContentState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { Editor } from 'react-draft-wysiwyg';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

/// edit
import htmlToDraft from 'html-to-draftjs';

const WYSIWYG = (props) => {
const [editorData, setEditorData] = useState({
editorState: EditorState.createEmpty()
})

    const onEditorStateChange = (editorData) => {
       // console.log(editorData.getCurrentContent())
        let HTMLdata = stateToHTML(editorData.getCurrentContent())

        setEditorData({
            editorState:editorData
        });

        props.setEditorState(HTMLdata)
    }


    return(
        <div>
            <Editor
                editorState={editorData.editorState}
                onEditorStateChange={onEditorStateChange}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
            />
        </div>
    )

}

export default WYSIWYG;

</code>

add it to add.js:

<code>
import WYSIWYG from '../../../utils/forms/wysiwyg';
</code>

and also add this to add.js:

<code>
const dispatch = useDispatch();
    const notifications = useSelector(state=>state.notifications) 
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editorBlur,setEditorBlur] = useState(false);

    [...]

<WYSIWYG
setEditorState={(state)=> handleEditorState(state)}
setEditorBlur={(blur)=> handleEditorBlur(blur)}
/>

                    { formik.errors.content && editorBlur ?
                        <FormHelperText error={true}>
                            {formik.errors.content}
                        </FormHelperText>
                    :null}


                    <TextField
                        type="hidden"
                        name="content"
                        {...formik.getFieldProps('content')}
                    />

</code>

## an example of setting the dashboard for posts and other types of content:

store/types.js:

server/models/post_model.js

<code>
const mongoose = require('mongoose')
const aggregatePaginate = require('mongoose-aggregate-paginate-v2')
require('dotenv').config()

/_ slugs _/
;(slug = require('mongoose-slug-updater')), mongoose.plugin(slug)

const postSchema = mongoose.Schema({
title: {
type: String,
maxLength: 250,
required: [true, 'You need a title'],
},
slug: {
type: String,
maxLength: 250,
required: [true, 'You need a slug'] /_ todo! revise this _/,
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
date: {
type: Date,
default: Date.now,
},
})

postSchema.plugin(aggregatePaginate)

const Post = mongoose.model('Post', postSchema)
module.exports = { Post }

</code>

<code>
export const ADD_SINGLE_POST = 'add_single_post'
</code>

store/actions/post_actions.js:

<code>
import { getAuthHeader } from '../../utils/tools' <!-- gets the token after auth -->

export const addPost = (post) => {
return async (dispatch) => {
try {
const request = await axios.post(
`/api/posts/admin/add_posts`,
post,
getAuthHeader()
)

      dispatch(posts.addArticle(request.data))
      dispatch(posts.successGlobal('Added post.'))
    } catch (error) {
      dispatch(posts.errorGlobal(error.response.data.message))
    }

}
}

</code>

store/actions/index.js:

<code>
import {
  GET_ARTICLES,
  GET_ARTICLE,
  ADD_ARTICLE,
  CLEAR_CURRENT_ARTICLE,
  GET_BLACKGUARD_POSTS,
  GET_SINGLE_BLACKGUARD_POST,
  GET_PUBLICACIONES,
  GET_SINGLE_PUBLICACION,
  GET_POSTS,
  GET_SINGLE_POST,
  ADD_SINGLE_POST,
  ERROR_GLOBAL,
  SUCCESS_GLOBAL,
  CLEAR_NOTIFICATION,
  AUTH_USER,
  SIGN_OUT,
  SITE_LAYOUT,
} from '../types'

</code>

on store/posts_reducer.js:

<code>
import { GET_POSTS, GET_SINGLE_POST, ADD_SINGLE_POST } from '../types'
export default function postReducer(state = {}, action) {
  switch (action.type) {
    case GET_POSTS:
      return { ...state, posts: action.payload }
    case GET_SINGLE_POST:
      return { ...state, current: action.payload }
    case ADD_SINGLE_POST:
      return { ...state, lastAdded: action.payload, success: true }
    default:
      return state
  }
}

</code>

on dashboard/posts/validationSchema.js:

<code>
import * as Yup from 'yup'

export const formValues = {
title: '',
slug: '',
content: '',
excerpt: '',
thumbnail: '',
author: '',
category: [],
tags: [],
status: 'draft',
}

export const validation = () =>
Yup.object({
title: Yup.string().required('Sorry the title is required'),
content: Yup.string()
.required('Sorry the content is required')
.min(10, 'Write some more, please.'),
excerpt: Yup.string()
.required('Sorry the excerpt is required')
.max(1000, 'Sorry its 500 max'),
author: Yup.string().required('Sorry the author is required'),
slug: Yup.string().required('Sorry the slug is required'),
category: Yup.array().required('Must have at least one category'),
tags: Yup.array().required('Must have actors').min(3, 'Minimum is 3'),
status: Yup.string().required('Sorry the status is required'),
})

</code>

on dashboard/posts/add.js:

<code>

import React, { useState, useEffect, useRef } from 'react'
import AdminLayout from '../../../components/layout/adminLayout'
import { useFormik, FieldArray, FormikProvider } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { validation, formValues } from './validationSchema'
import { addPost } from '../../../store/actions/post_actions'
import Loader from '../../../utils/loader'
import { useNavigate } from 'react-router-dom'
import { slugify } from '../../../utils/tools'

/_ importing bootstrap _/
import { Form, Button } from 'react-bootstrap'

/_ wysiwyg _/

import WYSIWYG from '../../../utils/forms/wysiwyg'

import {
TextField,
Divider,
Chip,
Paper,
InputBase,
IconButton,
FormHelperText,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'

const AddPost = (props) => {
const navigate = useNavigate()
const dispatch = useDispatch()
const notifications = useSelector((state) => state.notifications)
const [isSubmitting, setIsSubmitting] = useState(false)
const [editorBlur, setEditorBlur] = useState(false)
const tagsValue = useRef('')
const categoryValue = useRef('')
const formik = useFormik({
enableReinitialize: true,
initialValues: formValues,
/_ validationSchema: validation, _/
onSubmit: (values, { resetForm }) => {
console.log(values)
setIsSubmitting(true)
dispatch(addPost(values))
},
})

const handleEditorState = (state) => {
formik.setFieldValue('content', state, true)
}

const handleEditorBlur = (blur) => {
setEditorBlur(true)
}

const errorHelper = (formik, values) => ({
error: formik.errors[values] && formik.touched[values] ? true : false,
helperText:
formik.errors[values] && formik.touched[values]
? formik.errors[values]
: null,
})

useEffect(() => {
if (notifications && notifications.success) {
navigate('/dashboard/posts')
}
if (notifications && notifications.error) {
setIsSubmitting(false)
}
}, [notifications, navigate])

return (
<AdminLayout section='Add post'>
{isSubmitting ? (
<Loader />
) : (

<Form className='mt-3 post_form' onSubmit={formik.handleSubmit}>
<div className='form-group'>
<Form.Control
style={{ width: '100%' }}
type='title'
placeholder='Enter a title'
variant='outlined'
{...formik.getFieldProps('title')}
{...errorHelper(formik, 'title')}
/>
</div>

          <textarea
            name='slug'
            placeholder='enter slug'
            {...formik.getFieldProps('slug')}
          />

          <div className='form-group'>
            <Form.Control
              style={{ width: '100%' }}
              type='excerpt'
              placeholder='Enter an excerpt'
              variant='outlined'
              {...formik.getFieldProps('excerpt')}
              {...errorHelper(formik, 'excerpt')}
            />
          </div>
          <div className='form-group'>
            <Form.Control
              style={{ width: '100%' }}
              type='thumbnail'
              placeholder='Enter an thumbnail'
              variant='outlined'
              {...formik.getFieldProps('thumbnail')}
              {...errorHelper(formik, 'thumbnail')}
            />
          </div>

          <div className='form-group'>
            <WYSIWYG
              setEditorState={(state) => handleEditorState(state)}
              setEditorBlur={(blur) => handleEditorBlur(blur)}
            />

            {formik.errors.content && editorBlur ? (
              <FormHelperText error={true}>
                {formik.errors.content}
              </FormHelperText>
            ) : null}

            <TextField
              type='hidden'
              name='content'
              {...formik.getFieldProps('content')}
            />
          </div>

          <Divider className='mt-3 mb-3' />
          {/*           <h5>Movie data and score</h5>
          <div className='form-group'>
            <Form.Control
              style={{ width: '100%' }}
              type='score'
              placeholder='Enter a score'
              variant='outlined'
              {...formik.getFieldProps('score')}
              {...errorHelper(formik, 'score')}
            />
          </div> */}

          <FormikProvider value={formik}>
            <h5>Add the tags:</h5>
            <FieldArray
              name='tags'
              render={(arrayhelpers) => (
                <div>
                  <Paper className='tags_form'>
                    <InputBase
                      inputRef={tagsValue}
                      className='input'
                      placeholder='Add tags here'
                    />
                    <IconButton
                      onClick={() => {
                        arrayhelpers.push(tagsValue.current.value)
                        tagsValue.current.value = ''
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Paper>
                  {formik.errors.tags && formik.touched.tags ? (
                    <FormHelperText error={true}>
                      {formik.errors.tags}
                    </FormHelperText>
                  ) : null}

                  <div className='chip_container'>
                    {formik.values.tags.map((actor, index) => (
                      <div key={actor}>
                        <Chip
                          label={`${actor}`}
                          color='primary'
                          onDelete={() => arrayhelpers.remove(index)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            />
          </FormikProvider>
          <FormikProvider value={formik}>
            <h5>Add the category:</h5>
            <FieldArray
              name='category'
              render={(arrayhelpers) => (
                <div>
                  <Paper className='category_form'>
                    <InputBase
                      inputRef={categoryValue}
                      className='input'
                      placeholder='Add category here'
                    />
                    <IconButton
                      onClick={() => {
                        arrayhelpers.push(categoryValue.current.value)
                        categoryValue.current.value = ''
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Paper>
                  {formik.errors.category && formik.touched.category ? (
                    <FormHelperText error={true}>
                      {formik.errors.category}
                    </FormHelperText>
                  ) : null}

                  <div className='chip_container'>
                    {formik.values.category.map((category, index) => (
                      <div key={category}>
                        <Chip
                          label={`${category}`}
                          color='primary'
                          onDelete={() => arrayhelpers.remove(index)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            />
          </FormikProvider>

          <div className='form-group'>
            <Form.Control
              style={{ width: '100%' }}
              type='author'
              placeholder='Enter a author'
              variant='outlined'
              {...formik.getFieldProps('author')}
              {...errorHelper(formik, 'author')}
            />
          </div>
          <div className='form-group'>
            <Form.Control
              style={{ width: '100%' }}
              type='category'
              placeholder='Enter a category'
              variant='outlined'
              {...formik.getFieldProps('category')}
              {...errorHelper(formik, 'category')}
            />
          </div>

          <div>
            <h5>Select a status</h5>
            <select
              className='form-select'
              type='status'
              {...formik.getFieldProps('status')}
              error={
                formik.errors.status && formik.touched.status ? true : false
              }
            >
              <option value=''>None</option>
              <option value='draft'>Draft</option>
              <option value='public'>Public</option>
            </select>
            {formik.errors.status && formik.touched.status ? (
              <FormHelperText error={true}>
                {formik.errors.status}
              </FormHelperText>
            ) : null}
          </div>
          <div>
            <h5>featured post?</h5>
            <select
              className='form-select'
              type='featuredPost'
              {...formik.getFieldProps('featuredPost')}
              error={
                formik.errors.status && formik.touched.status ? true : false
              }
            >
              <option value='true'>true</option>
              <option value='false'>false</option>
            </select>
            {formik.errors.status && formik.touched.status ? (
              <FormHelperText error={true}>
                {formik.errors.status}
              </FormHelperText>
            ) : null}
          </div>

          <Divider className='mt-3 mb-3' />
          <Button
            variant='primary'
            size='small'
            type='submit'
            // disabled={false}
          >
            Add post
          </Button>
        </Form>
      )}
    </AdminLayout>

)
}

export default AddPost

</code>

## pagination on dashboard!

an example of pagination in articles:

actions/article_actions.js:

<code>

export const getPaginateArticles = (page = 1, limit = 5) => {
return async (dispatch) => {
try {
const request = await axios.post(
`/api/articles/admin/paginate`,
{
page,
limit,
},
getAuthHeader()
)

      dispatch(articles.getPaginateArticles(request.data))
    } catch (error) {
      dispatch(articles.errorGlobal(error.response.data.message))
    }

}
}

</code>

actions/index.js:

<code>
import {
  GET_ARTICLES,
  GET_ARTICLE,
  ADD_ARTICLE,
  CLEAR_CURRENT_ARTICLE,
  GET_PAGINATED_ARTICLES,
  GET_BLACKGUARD_POSTS,
  GET_SINGLE_BLACKGUARD_POST,
  ADD_SINGLE_BLACKGUARD_POST,
  GET_PUBLICACIONES,
  GET_SINGLE_PUBLICACION,
  ADD_SINGLE_PUBLICACION,
  GET_POSTS,
  GET_SINGLE_POST,
  ADD_SINGLE_POST,
  ERROR_GLOBAL,
  SUCCESS_GLOBAL,
  CLEAR_NOTIFICATION,
  AUTH_USER,
  SIGN_OUT,
  SITE_LAYOUT,
  ADD_SINGLE_PROJECT,
  ADD_SINGLE_PROYECTO,
  ADD_SINGLE_TMIK,
} from '../types'

export const getPaginateArticles = (articles) => ({
type: GET_PAGINATED_ARTICLES,
payload: articles,
})
</code>

on store/types.js:

<code>
export const GET_PAGINATED_ARTICLES = 'get_admin_articles'
</code>

on reducers/articles_reducer.js:

<code>
import {
  GET_ARTICLES,
  GET_ARTICLE,
  ADD_ARTICLE,
  CLEAR_CURRENT_ARTICLE,
  GET_PAGINATED_ARTICLES,
} from '../types'

export default function articleReducer(state = {}, action) {
switch (action.type) {
case GET_ARTICLES:
return { ...state, articles: action.payload }
case GET_ARTICLE:
return { ...state, current: action.payload }
case ADD_ARTICLE:
return { ...state, lastAdded: action.payload, success: true }
case CLEAR_CURRENT_ARTICLE:
return { ...state, current: '' }
case GET_PAGINATED_ARTICLES:
return { ...state, adminArticles: action.payload }
default:
return state
}
}

</code>

on dashboard/articles/index.js:

<code>
import React, { useEffect } from 'react'
import AdminLayout from '../../../components/layout/adminLayout'

import {
Modal,
Button,
ButtonToolbar,
ButtonGroup,
InputGroup,
FormControl,
} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

import { useDispatch, useSelector } from 'react-redux'
import { getPaginateArticles } from '../../../store/actions/article_actions'

import PaginationArticles from './paginateArticles'

const Articles = () => {
const articles = useSelector((state) => state.articles)
const dispatch = useDispatch()
const arts = articles.adminArticles
/_ keyword used in articles_reducer _/

useEffect(() => {
dispatch(getPaginateArticles())
}, [dispatch])

const goToPrevPage = (page) => {
dispatch(getPaginateArticles(page))
}

const goToNextPage = (page) => {
dispatch(getPaginateArticles(page))
}

return (
<AdminLayout section='Articles'>

<div className='articles_table'>
<ButtonToolbar className='mb-3'>
<ButtonGroup className='mr-2'>
<LinkContainer to='/dashboard/articles/add'>
<Button variant='secondary'>Add article</Button>
</LinkContainer>
</ButtonGroup>
<form onSubmit={() => alert('search')}>
<InputGroup>
<InputGroup>
<InputGroup.Text id='btnGroupAddon2'>@</InputGroup.Text>
</InputGroup>
<FormControl type='text' placeholder='Example' />
</InputGroup>
</form>
</ButtonToolbar>
</div>
<PaginationArticles
arts={arts}
prev={(page) => goToPrevPage(page)}
next={(page) => goToNextPage(page)}
/>
</AdminLayout>
)
}

export default Articles

</code>

and on the newly created paginateArticles.js:

<code>
import React from 'react'
import { Table, Pagination } from 'react-bootstrap'
import moment, { parseTwoDigitYear } from 'moment'
import Loader from '../../../utils/loader'

const PaginationArticles = ({ arts, prev, next }) => {
const goToPrevPage = (page) => {
prev(page)
}
const goToNextPage = (page) => {
next(page)
}
return (
<>
{arts && arts.docs ? (

<div>
<Table striped bordered hover>
content
<thead>
<tr>
<th>created</th>
<th>title</th>
</tr>
</thead>
<tbody>
{arts.docs.map((item) => (
<tr key={item._id}>
<td>{moment(item.date).format('YYYY/MM/DD')}</td>
<td>{item.title}</td>
</tr>
))}
</tbody>
</Table>
<Pagination>
{arts.hasPrevPage ? (
<>
<Pagination.Prev
onClick={() => goToPrevPage(arts.prevPage)} ></Pagination.Prev>
<Pagination.Item onClick={() => goToPrevPage(arts.prevPage)}>
{arts.prevPage}
</Pagination.Item>
</>
) : null}
<Pagination.Item active>{arts.page}</Pagination.Item>
{arts.hasNextPage ? (
<>
<Pagination.Item onClick={() => goToNextPage(arts.nextPage)}>
{arts.nextPage}
</Pagination.Item>
<Pagination.Next
onClick={() => goToNextPage(arts.nextPage)} ></Pagination.Next>
</>
) : null}
</Pagination>
</div>
) : (
<Loader />
)}
</>
)
}

export default PaginationArticles

</code>

## changing article status

on paginateArticles.js:

<code>
import React from 'react'
import { Table, Pagination } from 'react-bootstrap'
import moment, { parseTwoDigitYear } from 'moment'
import Loader from '../../../utils/loader'

const PaginationArticles = ({
arts,
prev,
next,
handleStatusChange,
editArtsAction,
}) => {
const goToPrevPage = (page) => {
prev(page)
}
const goToNextPage = (page) => {
next(page)
}
return (
<>
{arts && arts.docs ? (

<div>
<Table striped bordered hover>
content
<thead>
<tr>
<th>created</th>
<th>title</th>
</tr>
</thead>
<tbody>
{arts.docs.map((item) => (
<tr key={item._id}>
<td>{moment(item.date).format('YYYY/MM/DD')}</td>
<td>{item.title}</td>
<td
className='action_btn remove_btn'
onClick={() => alert(item.\_id)} >
Remove
</td>
<td
className='action_btn edit_btn'
onClick={() => editArtsAction(item.\_id)} >
Edit
</td>
<td
className='action_btn status_btn'
onClick={() => handleStatusChange(item.status, item.\_id)} >
{item.status}
</td>
</tr>
))}
</tbody>
</Table>
<Pagination>
{arts.hasPrevPage ? (
<>
<Pagination.Prev
onClick={() => goToPrevPage(arts.prevPage)} ></Pagination.Prev>
<Pagination.Item onClick={() => goToPrevPage(arts.prevPage)}>
{arts.prevPage}
</Pagination.Item>
</>
) : null}
<Pagination.Item active>{arts.page}</Pagination.Item>
{arts.hasNextPage ? (
<>
<Pagination.Item onClick={() => goToNextPage(arts.nextPage)}>
{arts.nextPage}
</Pagination.Item>
<Pagination.Next
onClick={() => goToNextPage(arts.nextPage)} ></Pagination.Next>
</>
) : null}
</Pagination>
</div>
) : (
<Loader />
)}
</>
)
}

export default PaginationArticles

</code>

on dashboard/articles/index.js:

<code>
import React, { useEffect } from 'react'
import AdminLayout from '../../../components/layout/adminLayout'
import { useNavigate } from 'react-router-dom'

import {
Modal,
Button,
ButtonToolbar,
ButtonGroup,
InputGroup,
FormControl,
} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

import { useDispatch, useSelector } from 'react-redux'
import { getPaginateArticles } from '../../../store/actions/article_actions'
import { changeStatusArticle } from '../../../store/actions/article_actions'

import PaginationArticles from './paginateArticles'

const Articles = () => {
const navigate = useNavigate()
const articles = useSelector((state) => state.articles)
const dispatch = useDispatch()
const arts = articles.adminArticles
/_ keyword used in articles_reducer _/

useEffect(() => {
dispatch(getPaginateArticles())
}, [dispatch])

const editArtsAction = (id) => {
navigate(`/dashboard/articles/edit/${id}`)
}

const handleStatusChange = (status, \_id) => {
let newStatus = status === 'draft' ? 'public' : 'draft'
dispatch(changeStatusArticle(newStatus, \_id))
}

const goToPrevPage = (page) => {
dispatch(getPaginateArticles(page))
}

const goToNextPage = (page) => {
dispatch(getPaginateArticles(page))
}

return (
<AdminLayout section='Articles'>

<div className='articles_table'>
<ButtonToolbar className='mb-3'>
<ButtonGroup className='mr-2'>
<LinkContainer to='/dashboard/articles/add'>
<Button variant='secondary'>Add article</Button>
</LinkContainer>
</ButtonGroup>
<form onSubmit={() => alert('search')}>
<InputGroup>
<InputGroup>
<InputGroup.Text id='btnGroupAddon2'>@</InputGroup.Text>
</InputGroup>
<FormControl type='text' placeholder='Example' />
</InputGroup>
</form>
</ButtonToolbar>
</div>
<PaginationArticles
arts={arts}
prev={(page) => goToPrevPage(page)}
next={(page) => goToNextPage(page)}
handleStatusChange={(status, id) => handleStatusChange(status, id)}
editArtsAction={(id) => editArtsAction(id)}
/>
</AdminLayout>
)
}

export default Articles

</code>

on actions/article_actions.js:

<code>

export const changeStatusArticle = (status,\_id) => {
return async(dispatch, getState)=>{
try{
const article = await axios.patch(`/api/articles/admin/${_id}`,{
status
},getAuthHeader());

            let art = article.data;
            let state = getState().articles.adminArticles.docs; /// previous state
            let position = state.findIndex( art => art._id === _id); /// find the position
            state[position] = art;

            dispatch(articles.updateArticleStatus(state));
            dispatch(articles.successGlobal('Cool !!'));
        }catch(error){
            dispatch(articles.errorGlobal(error.response.data.message));
        }
    }

}
</code>

on actions.index.js:

<code>
import {
  GET_ARTICLES,
  GET_ARTICLE,
  ADD_ARTICLE,
  CLEAR_CURRENT_ARTICLE,
  GET_PAGINATED_ARTICLES,
  UPDATE_ARTICLE_STATUS,
  GET_BLACKGUARD_POSTS,
  GET_SINGLE_BLACKGUARD_POST,
  ADD_SINGLE_BLACKGUARD_POST,
  GET_PUBLICACIONES,
  GET_SINGLE_PUBLICACION,
  ADD_SINGLE_PUBLICACION,
  GET_POSTS,
  GET_SINGLE_POST,
  ADD_SINGLE_POST,
  ERROR_GLOBAL,
  SUCCESS_GLOBAL,
  CLEAR_NOTIFICATION,
  AUTH_USER,
  SIGN_OUT,
  SITE_LAYOUT,
  ADD_SINGLE_PROJECT,
  ADD_SINGLE_PROYECTO,
  ADD_SINGLE_TMIK,
} from '../types'

/_ articles _/

export const addArticle = (article) => ({
type: ADD_ARTICLE,
payload: article,
})

export const getArticles = (articles) => ({
type: GET_ARTICLES,
payload: articles,
})

export const getArticle = (article) => ({
type: GET_ARTICLE,
payload: article,
})

export const clearCurrentArticle = () => ({
type: CLEAR_CURRENT_ARTICLE,
})

export const getPaginateArticles = (articles) => ({
type: GET_PAGINATED_ARTICLES,
payload: articles,
})

export const updateArticleStatus = (articles) => ({
type: UPDATE_ARTICLE_STATUS,
payload: articles,
})

/_ posts _/
export const getPosts = (posts) => ({
type: GET_POSTS,
payload: posts,
})

export const getSinglePost = (post) => ({
type: GET_SINGLE_POST,
payload: post,
})

export const addPost = (post) => ({
type: ADD_SINGLE_POST,
payload: post,
})

/_ publicaciones _/
export const getPublicaciones = (publicaciones) => ({
type: GET_PUBLICACIONES,
payload: publicaciones,
})

export const getSinglePublicacion = (publicacion) => ({
type: GET_SINGLE_PUBLICACION,
payload: publicacion,
})

export const addSinglePublicacion = (publicacion) => ({
type: ADD_SINGLE_PUBLICACION,
payload: publicacion,
})

/_ blackguard posts _/
export const getBlackguardPosts = (blackguard_posts) => ({
type: GET_BLACKGUARD_POSTS,
payload: blackguard_posts,
})

export const getSingleBlackguardPost = (blackguard_post) => ({
type: GET_SINGLE_BLACKGUARD_POST,
payload: blackguard_post,
})

export const addSingleBlackguardPost = (blackguard_post) => ({
type: ADD_SINGLE_BLACKGUARD_POST,
payload: blackguard_post,
})

/_ notifications _/

export const errorGlobal = (msg) => ({
type: ERROR_GLOBAL,
payload: msg,
})

export const successGlobal = (msg) => ({
type: SUCCESS_GLOBAL,
payload: msg,
})

export const clearNotification = () => {
return (dispatch) => {
dispatch({
type: CLEAR_NOTIFICATION,
})
}
}

/_ auth! _/

export const authUser = (user) => ({
type: AUTH_USER,
payload: user,
})

export const signOut = () => ({
type: SIGN_OUT,
})

/_ layouts _/

export const appLayout = (layout) => ({
type: SITE_LAYOUT,
payload: layout,
})

/_ projects _/

export const addProject = (project) => ({
type: ADD_SINGLE_PROJECT,
payload: project,
})

/_ proyectos _/
export const addProyecto = (proyecto) => ({
type: ADD_SINGLE_PROYECTO,
payload: proyecto,
})

export const addTmik = (tmik) => ({
type: ADD_SINGLE_TMIK,
payload: tmik,
})

</code>

on store/types.js:

<code>
export const UPDATE_ARTICLE_STATUS = 'update_article_status'
</code>

on reducers/articles_reducer.js:

<code>
import {
  GET_ARTICLES,
  GET_ARTICLE,
  ADD_ARTICLE,
  CLEAR_CURRENT_ARTICLE,
  GET_PAGINATED_ARTICLES,
  UPDATE_ARTICLE_STATUS,
} from '../types'

export default function articleReducer(state = {}, action) {
switch (action.type) {
case GET_ARTICLES:
return { ...state, articles: action.payload }
case GET_ARTICLE:
return { ...state, current: action.payload }
case ADD_ARTICLE:
return { ...state, lastAdded: action.payload, success: true }
case CLEAR_CURRENT_ARTICLE:
return { ...state, current: '' }
case GET_PAGINATED_ARTICLES:
return { ...state, adminArticles: action.payload }
case UPDATE_ARTICLE_STATUS:
return {
...state,
adminArticles: {
...state.adminArticles,
docs: action.payload,
},
}
default:
return state
}
}

</code>

## removing articles:

on dashboard/articles/index.js:

<code>
import React, { useEffect, useState } from 'react'
import AdminLayout from '../../../components/layout/adminLayout'
import { useNavigate } from 'react-router-dom'

import {
Modal,
Button,
ButtonToolbar,
ButtonGroup,
InputGroup,
FormControl,
} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

import { useDispatch, useSelector } from 'react-redux'
import { getPaginateArticles } from '../../../store/actions/article*actions'
import { changeStatusArticle } from '../../../store/actions/article_actions'
import { removeArticle } from '../../../store/actions/article_actions'
/* todo: clean this up \_/

import PaginationArticles from './paginateArticles'

const Articles = () => {
const notifications = useSelector((state) => state.notifications)
const navigate = useNavigate()
const articles = useSelector((state) => state.articles)
const dispatch = useDispatch()
const [removeAlert, setRemoveAlert] = useState(false)
const [toRemove, setToRemove] = useState(false)
const arts = articles.adminArticles
/_ keyword used in articles_reducer _/

const handleClose = () => setRemoveAlert(false)
const handleShow = (id = null) => {
setToRemove(id)
setRemoveAlert(true)
console.log(id)
}

const handleDelete = () => {
/_ dispatch goes here _/
dispatch(removeArticle(toRemove))
console.log(toRemove)
}

const editArtsAction = (id) => {
navigate(`/dashboard/articles/edit/${id}`)
}

const handleStatusChange = (status, \_id) => {
let newStatus = status === 'draft' ? 'public' : 'draft'
dispatch(changeStatusArticle(newStatus, \_id))
}

const goToPrevPage = (page) => {
dispatch(getPaginateArticles(page))
}

const goToNextPage = (page) => {
dispatch(getPaginateArticles(page))
}

useEffect(() => {
handleClose()
if (notifications && notifications.removeArticle) {
dispatch(getPaginateArticles(arts.page))
}
}, [dispatch, notifications, arts])

useEffect(() => {
dispatch(getPaginateArticles())
}, [dispatch])

return (
<AdminLayout section='Articles'>

<div className='articles_table'>
<ButtonToolbar className='mb-3'>
<ButtonGroup className='mr-2'>
<LinkContainer to='/dashboard/articles/add'>
<Button variant='secondary'>Add article</Button>
</LinkContainer>
</ButtonGroup>
<form onSubmit={() => alert('search')}>
<InputGroup>
<InputGroup>
<InputGroup.Text id='btnGroupAddon2'>@</InputGroup.Text>
</InputGroup>
<FormControl type='text' placeholder='Example' />
</InputGroup>
</form>
</ButtonToolbar>
</div>
<PaginationArticles
arts={arts}
prev={(page) => goToPrevPage(page)}
next={(page) => goToNextPage(page)}
handleShow={(id) => handleShow(id)}
handleStatusChange={(status, id) => handleStatusChange(status, id)}
editArtsAction={(id) => editArtsAction(id)}
/>

      <Modal show={removeAlert} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>you sure, dude?</Modal.Title>
        </Modal.Header>
        <Modal.Body>This action is definitive.</Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Cancel and close.
          </Button>
          <Button variant='danger' onClick={handleDelete}>
            Delete.
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>

)
}

export default Articles

</code>

on paginateArticles.js:

<code>
import React from 'react'
import { Table, Pagination } from 'react-bootstrap'
import moment, { parseTwoDigitYear } from 'moment'
import Loader from '../../../utils/loader'

const PaginationArticles = ({
arts,
prev,
next,
handleStatusChange,
editArtsAction,
handleShow,
}) => {
const goToPrevPage = (page) => {
prev(page)
}
const goToNextPage = (page) => {
next(page)
}
return (
<>
{arts && arts.docs ? (

<div>
<Table striped bordered hover>
content
<thead>
<tr>
<th>created</th>
<th>title</th>
</tr>
</thead>
<tbody>
{arts.docs.map((item) => (
<tr key={item._id}>
<td>{moment(item.date).format('YYYY/MM/DD')}</td>
<td>{item.title}</td>
<td
className='action_btn remove_btn'
onClick={() => handleShow(item.\_id)} >
Remove
</td>
<td
className='action_btn edit_btn'
onClick={() => editArtsAction(item.\_id)} >
Edit
</td>
<td
className='action_btn status_btn'
onClick={() => handleStatusChange(item.status, item.\_id)} >
{item.status}
</td>
</tr>
))}
</tbody>
</Table>
<Pagination>
{arts.hasPrevPage ? (
<>
<Pagination.Prev
onClick={() => goToPrevPage(arts.prevPage)} ></Pagination.Prev>
<Pagination.Item onClick={() => goToPrevPage(arts.prevPage)}>
{arts.prevPage}
</Pagination.Item>
</>
) : null}
<Pagination.Item active>{arts.page}</Pagination.Item>
{arts.hasNextPage ? (
<>
<Pagination.Item onClick={() => goToNextPage(arts.nextPage)}>
{arts.nextPage}
</Pagination.Item>
<Pagination.Next
onClick={() => goToNextPage(arts.nextPage)} ></Pagination.Next>
</>
) : null}
</Pagination>
</div>
) : (
<Loader />
)}
</>
)
}

export default PaginationArticles

</code>

on actions/index.js:

<code>
import {
  GET_ARTICLES,
  GET_ARTICLE,
  ADD_ARTICLE,
  CLEAR_CURRENT_ARTICLE,
  GET_PAGINATED_ARTICLES,
  UPDATE_ARTICLE_STATUS,
  REMOVE_ARTICLE,
  GET_BLACKGUARD_POSTS,
  GET_SINGLE_BLACKGUARD_POST,
  ADD_SINGLE_BLACKGUARD_POST,
  GET_PUBLICACIONES,
  GET_SINGLE_PUBLICACION,
  ADD_SINGLE_PUBLICACION,
  GET_POSTS,
  GET_SINGLE_POST,
  ADD_SINGLE_POST,
  ERROR_GLOBAL,
  SUCCESS_GLOBAL,
  CLEAR_NOTIFICATION,
  AUTH_USER,
  SIGN_OUT,
  SITE_LAYOUT,
  ADD_SINGLE_PROJECT,
  ADD_SINGLE_PROYECTO,
  ADD_SINGLE_TMIK,
} from '../types'

/_ articles _/

export const addArticle = (article) => ({
type: ADD_ARTICLE,
payload: article,
})

export const getArticles = (articles) => ({
type: GET_ARTICLES,
payload: articles,
})

export const getArticle = (article) => ({
type: GET_ARTICLE,
payload: article,
})

export const clearCurrentArticle = () => ({
type: CLEAR_CURRENT_ARTICLE,
})

export const getPaginateArticles = (articles) => ({
type: GET_PAGINATED_ARTICLES,
payload: articles,
})

export const updateArticleStatus = (articles) => ({
type: UPDATE_ARTICLE_STATUS,
payload: articles,
})

export const removeArticle = () => ({
type: REMOVE_ARTICLE,
})

/_ posts _/
export const getPosts = (posts) => ({
type: GET_POSTS,
payload: posts,
})

export const getSinglePost = (post) => ({
type: GET_SINGLE_POST,
payload: post,
})

export const addPost = (post) => ({
type: ADD_SINGLE_POST,
payload: post,
})

/_ publicaciones _/

export const getPublicaciones = (publicaciones) => ({
type: GET_PUBLICACIONES,
payload: publicaciones,
})

export const getSinglePublicacion = (publicacion) => ({
type: GET_SINGLE_PUBLICACION,
payload: publicacion,
})

export const addSinglePublicacion = (publicacion) => ({
type: ADD_SINGLE_PUBLICACION,
payload: publicacion,
})

/_ blackguard posts _/
export const getBlackguardPosts = (blackguard_posts) => ({
type: GET_BLACKGUARD_POSTS,
payload: blackguard_posts,
})

export const getSingleBlackguardPost = (blackguard_post) => ({
type: GET_SINGLE_BLACKGUARD_POST,
payload: blackguard_post,
})

export const addSingleBlackguardPost = (blackguard_post) => ({
type: ADD_SINGLE_BLACKGUARD_POST,
payload: blackguard_post,
})

/_ notifications _/

export const errorGlobal = (msg) => ({
type: ERROR_GLOBAL,
payload: msg,
})

export const successGlobal = (msg) => ({
type: SUCCESS_GLOBAL,
payload: msg,
})

export const clearNotification = () => {
return (dispatch) => {
dispatch({
type: CLEAR_NOTIFICATION,
})
}
}

/_ auth! _/

export const authUser = (user) => ({
type: AUTH_USER,
payload: user,
})

export const signOut = () => ({
type: SIGN_OUT,
})

/_ layouts _/

export const appLayout = (layout) => ({
type: SITE_LAYOUT,
payload: layout,
})

/_ projects _/

export const addProject = (project) => ({
type: ADD_SINGLE_PROJECT,
payload: project,
})

/_ proyectos _/
export const addProyecto = (proyecto) => ({
type: ADD_SINGLE_PROYECTO,
payload: proyecto,
})

export const addTmik = (tmik) => ({
type: ADD_SINGLE_TMIK,
payload: tmik,
})

</code>

on store/types.js:

<code>

export const REMOVE_ARTICLE = 'remove_article'

</code>

on article_actions.js:

<code>
export const removeArticle = (id) => {
  return async (dispatch) => {
    try {
      await axios.delete(`/api/articles/admin/${id}`, getAuthHeader())

      dispatch(articles.removeArticle())
      dispatch(articles.successGlobal('Item deleted.'))
    } catch (error) {
      dispatch(articles.errorGlobal(error.response.data.message))
    }

}
}

</code>

on notification_reducers.js:

<code>
import {
  ERROR_GLOBAL,
  SUCCESS_GLOBAL,
  CLEAR_NOTIFICATION,
  REMOVE_ARTICLE,
} from '../types'

export default function notificationReducer(state = {}, action) {
switch (action.type) {
case ERROR_GLOBAL:
return {
...state,
error: true,
msg: action.payload,
}
case SUCCESS_GLOBAL:
return { ...state, success: true, msg: action.payload }
case CLEAR_NOTIFICATION:
return {}
case REMOVE_ARTICLE:
return { ...state, removeArticle: true }
default:
return state
}
}

</code>

## editing articles:

create dashboard/articles/edit.js:

<code>
import React, { useState, useEffect, useRef } from 'react'
import AdminLayout from '../../../components/layout/adminLayout'
import { useFormik, FieldArray, FormikProvider } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { validation, formValues } from './validationSchema'
import {
  getAdminArticle,
  updateArticle,
} from '../../../store/actions/article_actions'
import { clearCurrentArticle } from '../../../store/actions/index'
import Loader from '../../../utils/loader'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'

/_ importing bootstrap _/
import { Form, Button } from 'react-bootstrap'

/_ wysiwyg _/

import WYSIWYG from '../../../utils/forms/wysiwyg'

import {
TextField,
Divider,
Chip,
Paper,
InputBase,
IconButton,
FormHelperText,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'

const EditArticle = (props) => {
const { id } = useParams()
const navigate = useNavigate()
const dispatch = useDispatch()
const notifications = useSelector((state) => state.notifications)
const articles = useSelector((state) => state.articles)
const [isSubmitting, setIsSubmitting] = useState(false)
const [editorBlur, setEditorBlur] = useState(false)
const [formData, setFormData] = useState(formValues)

/_ edit here setting a state to get all wysiwyg data _/
const [editContent, setEditContent] = useState(null)
/_ edit here _/

const tagsValue = useRef('')
const formik = useFormik({
enableReinitialize: true,
initialValues: formData,
validationSchema: validation,
onSubmit: (values, { resetForm }) => {
console.log(values)
setIsSubmitting(true)
dispatch(updateArticle(values, id))
},
})

const handleEditorState = (state) => {
formik.setFieldValue('content', state, true)
}

const handleEditorBlur = (blur) => {
setEditorBlur(true)
}

const errorHelper = (formik, values) => ({
error: formik.errors[values] && formik.touched[values] ? true : false,
helperText:
formik.errors[values] && formik.touched[values]
? formik.errors[values]
: null,
})

useEffect(() => {
if (notifications && notifications.success) {
navigate('/dashboard/articles')
}
if (notifications && notifications.error) {
setIsSubmitting(false)
}
}, [notifications, navigate])

/_ edit _/
useEffect(() => {
/_ getting current art _/
dispatch(getAdminArticle(id))
}, [dispatch, id])

useEffect(() => {
/_ get values of article and put them in the form _/
if (articles && articles.current) {
setFormData(articles.current)
/_ this almost works, we need to turn the wysiwyg obj into editable data _/
setEditContent(articles.current.content) /_ storing html info here _/
}
}, [articles])

useEffect(() => {
return () => {
dispatch(clearCurrentArticle())
}
}, [dispatch])

return (
<AdminLayout section='Add article'>
{isSubmitting ? (
<Loader />
) : (

<Form className='mt-3 article_form' onSubmit={formik.handleSubmit}>
<div className='form-group'>
<Form.Control
style={{ width: '100%' }}
type='title'
placeholder='Enter a title'
variant='outlined'
{...formik.getFieldProps('title')}
{...errorHelper(formik, 'title')}
/>
</div>

          <div className='form-group'>
            <Form.Control
              style={{ width: '100%' }}
              type='excerpt'
              placeholder='Enter an excerpt'
              variant='outlined'
              {...formik.getFieldProps('excerpt')}
              {...errorHelper(formik, 'excerpt')}
            />
          </div>

          <div className='form-group'>
            <WYSIWYG
              setEditorState={(state) => handleEditorState(state)}
              setEditorBlur={(blur) => handleEditorBlur(blur)}
              editContent={editContent}
            />

            {formik.errors.content && editorBlur ? (
              <FormHelperText error={true}>
                {formik.errors.content}
              </FormHelperText>
            ) : null}

            <TextField
              type='hidden'
              name='content'
              {...formik.getFieldProps('content')}
            />
          </div>

          <Divider className='mt-3 mb-3' />
          {/*           <h5>Movie data and score</h5>
          <div className='form-group'>
            <Form.Control
              style={{ width: '100%' }}
              type='score'
              placeholder='Enter a score'
              variant='outlined'
              {...formik.getFieldProps('score')}
              {...errorHelper(formik, 'score')}
            />
          </div> */}

          <FormikProvider value={formik}>
            <h5>Add the tags:</h5>
            <FieldArray
              name='tags'
              render={(arrayhelpers) => (
                <div>
                  <Paper className='tags_form'>
                    <InputBase
                      inputRef={tagsValue}
                      className='input'
                      placeholder='Add tags here'
                    />
                    <IconButton
                      onClick={() => {
                        arrayhelpers.push(tagsValue.current.value)
                        tagsValue.current.value = ''
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Paper>
                  {formik.errors.tags && formik.touched.tags ? (
                    <FormHelperText error={true}>
                      {formik.errors.tags}
                    </FormHelperText>
                  ) : null}

                  <div className='chip_container'>
                    {formik.values.tags.map((actor, index) => (
                      <div key={actor}>
                        <Chip
                          label={`${actor}`}
                          color='primary'
                          onDelete={() => arrayhelpers.remove(index)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            />
          </FormikProvider>

          <div className='form-group'>
            <Form.Control
              style={{ width: '100%' }}
              type='author'
              placeholder='Enter a author'
              variant='outlined'
              {...formik.getFieldProps('author')}
              {...errorHelper(formik, 'author')}
            />
          </div>
          <div className='form-group'>
            <Form.Control
              style={{ width: '100%' }}
              type='category'
              placeholder='Enter a category'
              variant='outlined'
              {...formik.getFieldProps('category')}
              {...errorHelper(formik, 'category')}
            />
          </div>

          <div>
            <h5>Select a status</h5>
            <select
              className='form-select'
              type='status'
              {...formik.getFieldProps('status')}
              error={
                formik.errors.status && formik.touched.status ? true : false
              }
            >
              <option value=''>None</option>
              <option value='draft'>Draft</option>
              <option value='public'>Public</option>
            </select>
            {formik.errors.status && formik.touched.status ? (
              <FormHelperText error={true}>
                {formik.errors.status}
              </FormHelperText>
            ) : null}
          </div>

          <Divider className='mt-3 mb-3' />
          <Button
            variant='primary'
            size='small'
            type='submit'
            // disabled={false}
          >
            Edit article
          </Button>
        </Form>
      )}
    </AdminLayout>

)
}

export default EditArticle

</code>

on routes.js:

<code>
import React, { useEffect, useState } from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import { isAuthUser } from './store/actions/user_actions'

import Loader from './utils/loader'

import Header from './components/navigation/header'
import Footer from './components/navigation/footer'

/_ pages _/
import Home from './components/pages/index'
import Tmik from './components/pages/tmik'
import BlogPage from './components/pages/blog'
import BlackguardIndex from './components/pages/blackguardIndex'
import BlackguardBlogPage from './components/pages/blackguardBlog'

import Layout from './components/layout/layout'

/_ dashboard _/
import Dashboard from './components/dashboard/index'
import Profile from './components/dashboard/profile'

import Posts from './components/dashboard/posts'
import Publicaciones from './components/dashboard/publicaciones'
import BlackguardPosts from './components/dashboard/blackguard_posts'

/_ auth guard! _/
import PrivateRoute from './components/auth/PrivateRoute'

import Auth from './components/auth/index'

/_ articles section _/
import Articles from './components/dashboard/articles'
import AddArticle from './components/dashboard/articles/add'
import Article from './components/articles/article/index'
import EditArticle from './components/dashboard/articles/edit'
/_ post/publicacion section _/
import Post from './components/portfolio/blog/post/post'
import Publicacion from './components/portfolio/blog/publicacion/publicacion'
import AddPost from './components/dashboard/posts/add'
import AddPublicacion from './components/dashboard/publicaciones/add'

/_ blackguard_post section _/
import BlackguardPost from './components/blackguard/blackguardpost/blackguardpost'
import AddBlackguardPost from './components/dashboard/blackguard_posts/add'

/_ projects/proyectos section _/
import Projects from './components/dashboard/projects/index'
import AddProject from './components/dashboard/projects/add'

import Proyectos from './components/dashboard/proyectos/index'
import AddProyecto from './components/dashboard/proyectos/add'

import Tmiks from './components/dashboard/tmik/index'
import AddTmik from './components/dashboard/tmik/add'

const RoutesFile = () => {
const [loading, setLoading] = useState(true)
const dispatch = useDispatch()
const users = useSelector((state) => state.users)

useEffect(() => {
dispatch(isAuthUser())
}, [dispatch])

useEffect(() => {
if (users.auth !== null) {
setLoading(false)
}
}, [users])
return (
<BrowserRouter>

<Header />
{loading ? (
<>
<Loader />
</>
) : (
<Layout>
<Routes>
<Route path='/blackguard_post/:id' element={<BlackguardPost />} />
<Route path='/publicacion/:id' element={<Publicacion />} />
<Route path='/post/:id' element={<Post />} />
<Route path='/article/:id' element={<Article />} />
<Route path='/' element={<Home />} />

            <Route path='/auth' element={<Auth />} />
            <Route path='/blackguard' element={<BlackguardIndex />} />
            <Route path='/blackguard_blog' element={<BlackguardBlogPage />} />
            <Route path='/tmik' element={<Tmik />} />
            <Route path='/blog' element={<BlogPage />} />
            {/* dashboard here */}
            {/* article; todo! I'm using ids, use slugs in everything else */}

            <Route
              path='/dashboard'
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path='/dashboard/articles'
              element={
                <PrivateRoute>
                  <Articles />
                </PrivateRoute>
              }
            />
            <Route
              path='/dashboard/articles/add'
              element={
                <PrivateRoute>
                  <AddArticle />
                </PrivateRoute>
              }
            />
            <Route
              path='/dashboard/articles/edit/:id'
              element={
                <PrivateRoute>
                  <EditArticle />
                </PrivateRoute>
              }
            />
            <Route
              path='/dashboard/profile'
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path='/dashboard/posts'
              element={
                <PrivateRoute>
                  <Posts />
                </PrivateRoute>
              }
            />
            <Route
              path='/dashboard/posts/add'
              element={
                <PrivateRoute>
                  <AddPost />
                </PrivateRoute>
              }
            />
            <Route
              path='/dashboard/publicaciones'
              element={
                <PrivateRoute>
                  <Publicaciones />
                </PrivateRoute>
              }
            />
            <Route
              path='/dashboard/publicaciones/add'
              element={
                <PrivateRoute>
                  <AddPublicacion />
                </PrivateRoute>
              }
            />

            <Route
              path='/dashboard/projects'
              element={
                <PrivateRoute>
                  <Projects />
                </PrivateRoute>
              }
            />
            <Route
              path='/dashboard/projects/add'
              element={
                <PrivateRoute>
                  <AddProject />
                </PrivateRoute>
              }
            />

            <Route
              path='/dashboard/proyectos'
              element={
                <PrivateRoute>
                  <Proyectos />
                </PrivateRoute>
              }
            />
            <Route
              path='/dashboard/proyectos/add'
              element={
                <PrivateRoute>
                  <AddProyecto />
                </PrivateRoute>
              }
            />
            <Route
              path='/dashboard/blackguard_posts'
              element={
                <PrivateRoute>
                  <BlackguardPosts />
                </PrivateRoute>
              }
            />
            <Route
              path='/dashboard/blackguard_posts/add'
              element={
                <PrivateRoute>
                  <AddBlackguardPost />
                </PrivateRoute>
              }
            />
            <Route
              path='/dashboard/tmiks'
              element={
                <PrivateRoute>
                  <Tmiks />
                </PrivateRoute>
              }
            />
            <Route
              path='/dashboard/tmiks/add'
              element={
                <PrivateRoute>
                  <AddTmik />
                </PrivateRoute>
              }
            />
          </Routes>
        </Layout>
      )}
      <Footer />
    </BrowserRouter>

)
}

export default RoutesFile

</code>

on actions/article_actions.js:

<code>

export const getAdminArticle = (id) => {
return async (dispatch) => {
try {
const request = await axios.get(
`/api/articles/admin/${id}`,
getAuthHeader()
)
dispatch(articles.getArticle(request.data))
} catch (error) {
dispatch(articles.getArticle(error.response.data.message))
dispatch(articles.errorGlobal(error.response.data.message))
}
}
}

export const updateArticle = (article, id) => {
return async (dispatch) => {
try {
const newArticle = await axios.patch(
`/api/articles/admin/${id}`,
article,
getAuthHeader()
)
dispatch(articles.getArticle(newArticle.data))
dispatch(articles.successGlobal('Item updated.'))
} catch (error) {
dispatch(articles.errorGlobal('Error updating article'))
}
}
}

</code>

on forms/wysiwyg.js:

<code>
import React, { useState, useEffect } from 'react'

//// wysiwyg
import { EditorState, ContentState } from 'draft-js'
import { stateToHTML } from 'draft-js-export-html'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

/// edit
import htmlToDraft from 'html-to-draftjs'

const WYSIWYG = (props) => {
const [editorData, setEditorData] = useState({
editorState: EditorState.createEmpty(),
})

const onEditorStateChange = (editorData) => {
// console.log(editorData.getCurrentContent())
let HTMLdata = stateToHTML(editorData.getCurrentContent())

    setEditorData({
      editorState: editorData,
    })

    props.setEditorState(HTMLdata)

}

/_ edit _/
useEffect(() => {
if (props.editContent) {
/_ converting html into draftjs _/
const blockFromHtml = htmlToDraft(props.editContent)
const { contentBlocks, entityMap } = blockFromHtml
const contentState = ContentState.createFromBlockArray(
contentBlocks,
entityMap
)

      setEditorData({
        editorState: EditorState.createWithContent(contentState),
      })
    }

}, [props.editContent])

return (

<div>
<Editor
        editorState={editorData.editorState}
        onEditorStateChange={onEditorStateChange}
        wrapperClassName='demo-wrapper'
        editorClassName='demo-editor'
        onBlur={props.setEditorBlur}
      />
</div>
)
}

export default WYSIWYG

</code>

## deploying!!!

first of all: heroku, create a new projects use env.vars in project settings and all that;

later on, on root/package.json:

<code>
  "scripts": {
    "start": "node server/server.js",
    "test": "echo \"Error: no test specified\" && exit 1",
    "server": "nodemon server/server.js",
    "client": "npm start --prefix client",
    "dev": "concurrently \"npm run server\" \"npm run client\" ",
    "heroku-postbuild": "npm install --force --prefix client && npm run build --prefix client"
  },
  "engines": {
    "node": "16.x"
  },
</code>

and on server/server.js:

<code>
/* every time this is in prod: */
app.use(express.static('client/build'))

if (process.env.NODE_ENV === 'production') {
const path = require('path')
app.get('/\*', (req, res) => {
res.sendFile(path.resolve(\_\_dirname, '../client', 'build', 'index.html'))
})
}
</code>
