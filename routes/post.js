const router = require('express').Router()
const { getAllPost, addPost, getSpecificPost, editPost, removePost, getMyPost, upvote, downvote } = require('../controllers/post')
const { authen, authorPost, checkOwnerPost } = require('../helpers/auth')

router.post('/', authen, addPost)
router.get('/', getAllPost)
router.get('/my-post', authen, getMyPost)


router.patch('/upvote', authen, checkOwnerPost, upvote)
router.patch('/downvote', authen, checkOwnerPost, downvote)


router.get('/:id', getSpecificPost)
router.put('/:id', authen, authorPost, editPost)
router.delete('/:id', authen, authorPost, removePost)

module.exports = router