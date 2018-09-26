const router = require('express').Router()
const { signin, signup, signinOther } = require('../controllers/user')
const post = require('./post')
const reply = require('./reply')
router.post('/signin-other', signinOther)
router.post('/signup', signup)
router.post('/signin', signin)
router.use('/post', post)
router.use('/reply', reply)

module.exports = router