const ObjectId = require('mongoose').Types.ObjectId
const { verify } = require('./jwt')
const User = require('../models/User')
const Post = require('../models/Post')
const Reply = require('../models/Reply')

module.exports = {
  authen: function (req, res, next) {
    verify(req.headers.token)
      .then(decoded => {
        return User.findOne({
          _id: ObjectId(decoded._id),
          email: decoded.email
        })
      })
      .then(user => {
        if (user) {
          next()
        } else {
          res.status(401).json({
            message: 'INVALID TOKEN'
          })
        }
      })
      .catch(err => {
        res.status(500).json(err)
      })
  },
  authorPost: function (req, res, next) {
    verify(req.headers.token)
      .then(decoded => {
        return Post.findOne({
          _id: ObjectId(req.params.id),
          owner: ObjectId(decoded._id)
        })
      })
      .then(post => {
        if (post) {
          next()
        } else {
          res.status(401).json({
            message: 'TIDAK ADA AKSES UNTUK EDIT POST'
          })
        }
      })
      .catch(err => {
        res.status(500).json(err)
      })
  },
  authorReply: function (req, res, next) {
    verify(req.headers.token)
      .then(decoded => {
        return Reply.findOne({
          _id: ObjectId('5ba8b21c6f1d335e9e1cf440'),
          owner: ObjectId(decoded._id)
        })
      })
      .then(reply => {
        // console.log(reply)
        if (reply) {
          next()
        } else {
          res.status(401).json({
            message: 'Tidak ada akses'
          })
        }
      })
      .catch(err => {
        res.status(500).json(err)
      })
  },
  checkOwnerReply: function (req, res, next) {
    verify(req.headers.token)
      .then(decoded => {
        return Reply.findOne({
          _id: ObjectId(req.body.replyId),
          owner: {
            $ne: ObjectId(decoded._id)
          }
        })
      })
      .then(reply => {
        if (reply) {
          next()
        } else {
          res.status(401).json({
            message: 'Tidak bisa Vote Sendiri'
          })
        }
      })
      .catch(err => {
        res.status(500).json(err)
      })
  },
  checkOwnerPost: function (req, res, next) {
    verify(req.headers.token)
      .then(decoded => {
        return Post.findOne({
          _id: ObjectId(req.body.postId),
          owner: {
            $ne: ObjectId(decoded._id)
          }
        })
      })
      .then(reply => {
        if (reply) {
          next()
        } else {
          res.status(401).json({
            message: 'Tidak bisa vote Sendiri'
          })
        }
      })
      .catch(err => {
        res.status(500).json(err)
      })
    // console.log(`masuk`)
  }
}