const router = require('express').Router()
const { addReply, editReply, upvote, downvote } = require('../controllers/reply')
const { authen, authorReply, checkOwnerReply } = require('../helpers/auth')

router.post('/', authen, addReply)
router.put('/', authen, authorReply, editReply)
router.patch('/upvote', authen, checkOwnerReply, upvote)
router.patch('/downvote', authen, checkOwnerReply, downvote)

module.exports = router
