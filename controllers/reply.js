const Reply = require('../models/Reply')
const Post = require('../models/Post')
const { verify } = require('../helpers/jwt')
const ObjectId = require('mongoose').Types.ObjectId

module.exports = {
  addReply (req, res) {
    let userId
    let post
    let newReply
    verify(req.headers.token)
      .then(decoded => {
        userId = decoded._id
        return Post.findById(ObjectId(req.body.postId))
      })
      .then(postDb => {
        post = postDb
        return Reply.create({
          body: req.body.body,
          owner: ObjectId(userId),
          post: ObjectId(post._id)
        })
      })
      .then(reply => {
        newReply = reply
        post.reply.push(ObjectId(reply._id))
        return post.save()
      })
      .then(post => {
        res.status(200).json(newReply)
      })
      .catch(err => {
        res.status(500).json(err)
      })
  },
  editReply (req, res) {
    Reply
      .findByIdAndUpdate(ObjectId(req.body.replyId),{
        body: req.body.body
      })
      .then(reply => {
        res.status(200).json({
          message: 'Berhasil Edit Reply'
        })
      })
      .catch(err => {
        res.status(500).json(err)
      })
  },
  upvote (req, res) {
    let replyUser
    Reply
      .findById(ObjectId(req.body.replyId))
      .then(reply => {
        replyUser = reply
        return verify(req.headers.token)
      })
      .then(decoded => {
        replyUser.upvote.push(ObjectId(decoded._id))
        delete replyUser.downvote[replyUser.downvote.indexOf(ObjectId(decoded._id))]
        replyUser.downvote = replyUser.downvote.filter(Boolean)

        let sama = false
        for (let i = 0 ; i < replyUser.upvote.length; i++) {
          for (let j = i+1; j < replyUser.upvote.length; j++) {
            if (String(replyUser.upvote[i]) == String(replyUser.upvote[j])) {
              sama = true
            } 
          }
        }
        if (sama) {
          return false
        } else {
          return Reply.findOneAndUpdate({ _id: ObjectId(replyUser._id) }, {
            upvote: replyUser.upvote,
            downvote: replyUser.downvote
          })
        }
      })
      .then(reply => {
        if (reply) {
          res.status(200).json({
            message: 'Berhasil Upvote'
          })
        } else {
          res.status(401).json({ message: 'Upvote Hanya Boleh Sekali' })
        }
      })
      .catch(err => {
        res.status(500).json(err)
      })
  },
  downvote (req, res) {
    let replyUser
    Reply
      .findById(ObjectId(req.body.replyId))
      .then(reply => {
        replyUser = reply
        return verify(req.headers.token)
      })
      .then(decoded => {
        delete replyUser.upvote[replyUser.upvote.indexOf(ObjectId(decoded._id))]
        replyUser.upvote = replyUser.upvote.filter(Boolean)
        replyUser.downvote.push(ObjectId(decoded._id))
        let sama = false
        for (let i = 0 ; i < replyUser.downvote.length; i++) {
          for (let j = i+1; j < replyUser.downvote.length; j++) {
            if (String(replyUser.downvote[i]) == String(replyUser.downvote[j])) {
              sama = true
            } 
          }
        }
        if (sama) {
          return false
        } else {
          return Reply.findOneAndUpdate({ _id: ObjectId(replyUser._id) }, {
            upvote: replyUser.upvote,
            downvote: replyUser.downvote
          })
        }
      })
      .then(reply => {
        if (reply) {
          res.status(200).json({
            message: 'Berhasil Downvote'
          })
        } else {
          res.status(401).json({ message: 'Downvote Hanya Boleh Sekali' })
        }
      })
      .catch(err => {
        res.status(500).json(err)
      })
  }
}