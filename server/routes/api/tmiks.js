const express = require('express')
let router = express.Router()
require('dotenv').config()
const { checkLoggedIn } = require('../../middleware/auth')
const { grantAccess } = require('../../middleware/roles')
const { sortArgsHelper } = require('../../config/helpers')

/* model */
const { Tmik } = require('../../models/tmik_model')

/* only the admin can do this */
router
  .route('/admin/add_tmiks')
  .post(checkLoggedIn, grantAccess('createAny', 'tmik'), async (req, res) => {
    try {
      /* validation would be here, but atm is not necessary */
      const tmik = new Tmik({
        ...req.body,
      })

      const result = await tmik.save()
      res.status(200).json(result)
    } catch (error) {
      res.status(400).json({ message: 'error adding tmik', error: error })
    }
  })

router
  .route('/admin/:id')
  .get(checkLoggedIn, grantAccess('readAny', 'tmik'), async (req, res) => {
    try {
      const _id = req.params.id
      const tmik = await Tmik.findById(_id)
      if (!tmik || tmik.length === 0) {
        return res.status(400).json({ message: 'Tmik not found' })
      }
      res.status(200).json(tmik)
    } catch (error) {
      res.status(400).json({ message: 'Error fetching tmik', error })
    }
  })
  .patch(checkLoggedIn, grantAccess('updateAny', 'tmik'), async (req, res) => {
    try {
      const _id = req.params.id
      const tmik = await Tmik.findOneAndUpdate(
        { _id },
        {
          $set: req.body,
        },
        {
          new: true,
        }
      )
      if (!tmik) return res.status(400).json({ message: 'Tmik not found' })
      res.status(200).json(tmik)
    } catch (error) {
      res.status(400).json({ message: 'Error updating tmik', error })
    }
  })
  .delete(checkLoggedIn, grantAccess('deleteAny', 'tmik'), async (req, res) => {
    try {
      const _id = req.params.id
      const tmik = await Tmik.findByIdAndRemove(_id)
      if (!tmik) return res.status(400).json({ message: 'Tmik not found' })
      res.status(200).json({ _id: tmik._id })
    } catch (error) {
      res.status(400).json({ message: 'Error deleting', error })
    }
  })

router
  .route('/admin/paginate')
  .post(checkLoggedIn, grantAccess('readAny', 'tmiks'), async (req, res) => {
    try {
      // let aggQuery = Post.aggregate([
      //     { $match: { status:"public" }},
      //     { $match: { title:{ $regex:/Lorem/ }}}
      // ])

      const limit = req.body.limit ? req.body.limit : 5
      const aggQuery = Tmik.aggregate()
      const options = {
        page: req.body.page,
        limit,
        sort: { _id: 'desc' },
      }

      const tmiks = await Tmik.aggregatePaginate(aggQuery, options)
      res.status(200).json(tmiks)
    } catch (error) {
      res.status(400).json({ message: 'Error', error })
    }
  })

/* no auth required */
router.route('/get_byid/:id').get(async (req, res) => {
  try {
    const _id = req.params.id
    const tmik = await Tmik.find({ _id: _id, status: 'public' })
    if (!tmik || tmik.length === 0) {
      return res.status(400).json({ message: 'Tmik not found' })
    }
    res.status(200).json(tmik)
  } catch (error) {
    res.status(400).json({ message: 'Error fetching tmik', error })
  }
})

router.route('/loadmore').post(async (req, res) => {
  try {
    let sortArgs = sortArgsHelper(req.body)
    /* todo: revert this to { status: 'public' } when updated db */
    const tmiks = await Tmik.find()
      .sort([[sortArgs.sortBy, sortArgs.order]])
      .skip(sortArgs.skip)
      .limit(sortArgs.limit)

    res.status(200).json(tmiks)
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Error fetching tmiks', error })
  }
})

router.route('/get_all').get(async (req, res) => {
  try {
    const tmiks = await Tmik.find()

    res.status(200).json(tmiks)
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Error fetching tmiks', error })
  }
})

module.exports = router
