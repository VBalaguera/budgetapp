const express = require('express')
let router = express.Router()
require('dotenv').config()
const { checkLoggedIn } = require('../../middleware/auth')
const { grantAccess } = require('../../middleware/roles')
const { sortArgsHelper } = require('../../config/helpers')

/* model */
const { Blackguard_Post } = require('../../models/blackguard_post_model')

/* only the admin can do this */
router
  .route('/admin/add_blackguard_post')
  .post(
    checkLoggedIn,
    grantAccess('createAny', 'blackguard_post'),
    async (req, res) => {
      try {
        /* validation would be here, but atm is not necessary */
        const blackguard_post = new Blackguard_Post({
          ...req.body,
        })

        const result = await blackguard_post.save()
        res.status(200).json(result)
      } catch (error) {
        res
          .status(400)
          .json({ message: 'error adding blackguard_post', error: error })
      }
    }
  )

router
  .route('/admin/:id')
  .get(
    checkLoggedIn,
    grantAccess('readAny', 'blackguard_post'),
    async (req, res) => {
      try {
        const _id = req.params.id
        const blackguard_post = await Blackguard_Post.findById(_id)
        if (!blackguard_post || blackguard_post.length === 0) {
          return res.status(400).json({ message: 'Post not found' })
        }
        res.status(200).json(blackguard_post)
      } catch (error) {
        res
          .status(400)
          .json({ message: 'Error fetching blackguard_post', error })
      }
    }
  )
  .patch(
    checkLoggedIn,
    grantAccess('updateAny', 'blackguard_post'),
    async (req, res) => {
      try {
        const _id = req.params.id
        const blackguard_post = await Blackguard_Post.findOneAndUpdate(
          { _id },
          {
            $set: req.body,
          },
          {
            new: true,
          }
        )
        if (!blackguard_post)
          return res.status(400).json({ message: 'Post not found' })
        res.status(200).json(blackguard_post)
      } catch (error) {
        res.status(400).json({ message: 'Error updating post', error })
      }
    }
  )
  .delete(
    checkLoggedIn,
    grantAccess('deleteAny', 'blackguard_post'),
    async (req, res) => {
      try {
        const _id = req.params.id
        const blackguard_post = await Blackguard_Post.findByIdAndRemove(_id)
        if (!blackguard_post)
          return res.status(400).json({ message: 'Post not found' })
        res.status(200).json({ _id: blackguard_post._id })
      } catch (error) {
        res.status(400).json({ message: 'Error deleting', error })
      }
    }
  )

router
  .route('/admin/paginate')
  .post(
    checkLoggedIn,
    grantAccess('readAny', 'blackguard_posts'),
    async (req, res) => {
      try {
        // let aggQuery = Post.aggregate([
        //     { $match: { status:"public" }},
        //     { $match: { title:{ $regex:/Lorem/ }}}
        // ])

        const limit = req.body.limit ? req.body.limit : 5
        const aggQuery = Blackguard_Post.aggregate()
        const options = {
          page: req.body.page,
          limit,
          sort: { _id: 'desc' },
        }

        const blackguard_posts = await Blackguard_Post.aggregatePaginate(
          aggQuery,
          options
        )
        res.status(200).json(blackguard_posts)
      } catch (error) {
        res.status(400).json({ message: 'Error', error })
      }
    }
  )

/* no auth required */
router.route('/get_byid/:slug').get(async (req, res) => {
  try {
    const slug = req.params.slug
    const blackguard_Post = await Blackguard_Post.find({
      slug: slug,
      /*       status: 'public', */
    })
    if (!blackguard_Post || blackguard_Post.length === 0) {
      return res.status(400).json({ message: 'Post not found' })
    }
    res.status(200).json(blackguard_Post)
  } catch (error) {
    res.status(400).json({ message: 'Error fetching Blackguard_Post', error })
  }
})

router.route('/loadmore').post(async (req, res) => {
  try {
    let sortArgs = sortArgsHelper(req.body)

    const blackguard_posts = await Blackguard_Post.find()
      .sort([[sortArgs.sortBy, sortArgs.order]])
      .skip(sortArgs.skip)
      .limit(sortArgs.limit)

    res.status(200).json(blackguard_posts)
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Error fetching Blackguard_Post', error })
  }
})

module.exports = router
