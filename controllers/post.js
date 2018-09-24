const Post = require('../models/Post')
const User = require('../models/User')
const { verify } = require('../helpers/jwt')
const ObjectId = require('mongoose').Types.ObjectId

module.exports = {
  getAllPost (req, res) {
    Post
      .find()
      .then(posts => {
        res.status(200).json(posts)
      })
      .catch(err => {
        res.status(500).json(err)
      })
  },
  addPost (req, res) {
    let dataUser
    let newPost
    verify(req.headers.token)
      .then(decoded => {
        return User.findById(ObjectId(decoded._id))
      })
      .then(user => {
        dataUser = user
        return Post.create({
          title: req.body.title,
          description: req.body.description,
          owner: ObjectId(user._id)
        })
      })
      .then(post => {
        newPost = post
        dataUser.post.push(post._id)
        return dataUser.save()
      })
      .then(user => {
        res.status(200).json(newPost)
      })
      .catch(err => {
        res.status(500).json(err)
      })
  },
  getSpecificPost (req, res) {
    Post
      .findById(ObjectId(req.params.id))
      .populate('reply')
      .then(post => {
        if (post) {
          res.status(200).json(post)
        }else {
          res.status(404).json({
            message: 'Post Not Found'
          })
        }
      })
  },
  editPost (req, res) {
    Post
      .findByIdAndUpdate(ObjectId(req.params.id), req.body)
      .then((post) => {
        res.status(200).json({
          message: 'Berhasil Edit Post'
        })
      })
      .catch(err => {
        res.status(500).json(err)
      })
  },
  removePost (req, res) {
    verify(req.headers.token)
      .then(decoded => {
        return User.findById(ObjectId(decoded._id))
      })
      .then(user => {
        delete user.post[user.post.indexOf(ObjectId(req.params.id))]
        user.post = user.post.filter(Boolean)
        return User.findByIdAndUpdate(ObjectId(user._id), {
          post: user.post
        })
      })
      .then(user => {
        return Post.findByIdAndRemove(ObjectId(req.params.id))
      })
      .then(deleted => {
        res.status(200).json({
          message: 'Berhasil Hapus Post'
        })
      })
      .catch(err => {
        res.status(500).json(err)
      })
  },
  getMyPost (req, res) {
    verify(req.headers.token)
      .then(decoded => {
        return User.findById(ObjectId(decoded._id)).populate('post')
      })
      .then(({post}) => {
        res.status(200).json(post)
      })
      .catch(err => {
        res.status(500).json(err)
      })
  },
  upvote (req, res) {
    let postUser
    Post
      .findById(ObjectId(req.body.postId))
      .then(post => {
        postUser = post
        return verify(req.headers.token)
      })
      .then(decoded => {
        postUser.upvote.push(ObjectId(decoded._id))
        delete postUser.downvote[postUser.downvote.indexOf(ObjectId(decoded._id))]
        postUser.downvote = postUser.downvote.filter(Boolean)
        let sama = false
        for (let i = 0 ; i < postUser.upvote.length; i++) {
          for (let j = i+1; j < postUser.upvote.length; j++) {
            if (String(postUser.upvote[i]) == String(postUser.upvote[j])) {
              sama = true
            } 
          }
        }
        if (sama) {
          return false
        } else {
          return Post.findOneAndUpdate({ _id: ObjectId(postUser._id) }, {
            upvote: postUser.upvote,
            downvote: postUser.downvote
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
    let postUser
    Post
      .findById(ObjectId(req.body.postId))
      .then(reply => {
        postUser = reply
        return verify(req.headers.token)
      })
      .then(decoded => {
        delete postUser.upvote[postUser.upvote.indexOf(ObjectId(decoded._id))]
        postUser.upvote = postUser.upvote.filter(Boolean)
        postUser.downvote.push(ObjectId(decoded._id))
        let sama = false
        for (let i = 0 ; i < postUser.downvote.length; i++) {
          for (let j = i+1; j < postUser.downvote.length; j++) {
            if (String(postUser.downvote[i]) == String(postUser.downvote[j])) {
              sama = true
            } 
          }
        }
        if (sama) {
          return false
        } else {
          return Post.findOneAndUpdate({ _id: ObjectId(postUser._id) }, {
            upvote: postUser.upvote,
            downvote: postUser.downvote
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