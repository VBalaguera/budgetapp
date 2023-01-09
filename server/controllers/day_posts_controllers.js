/* model */
const Day_Post = require('../models/day_model')

async function addDayPost(req, res) {
  try {
    /* validation would be here, but atm is not necessary */
    const day_post = new Day_Post({
      ...req.body,
    })

    const result = await day_post.save()
    res.status(200).json(result)
  } catch (error) {
    res.status(400).json({ message: 'error adding day', error: error })
  }
}

async function getDayPosts(req, res) {
  try {
    const day_post = await Day_Post.find()
    if (!day_post || day_post.length === 0) {
      return res.status(400).json({ message: 'Post not found' })
    }
    res.status(200).json(day_post)
    console.log(day_post)
  } catch (error) {
    res.status(400).json({ message: 'Error fetching day_post', error })
  }
}

async function updateDayPost(req, res) {
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

async function deleteDayPost(req, res) {
  try {
    const _id = req.params.id
    const day_post = await Day_Post.findByIdAndRemove(_id)
    if (!day_post) return res.status(400).json({ message: 'day not found' })
    res.status(200).json({ _id: day_post._id })
  } catch (error) {
    res.status(400).json({ message: 'Error deleting', error })
  }
}

async function paginateDayPost(req, res) {
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
    res.status(400).json({ message: 'Error getting pagination', error })
  }
}

async function getDayPostById(req, res) {
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
}

module.exports = {
  addDayPost,
  getDayPosts,
  updateDayPost,
  deleteDayPost,
  paginateDayPost,
  getDayPostById,
}
