const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema({
  title: String,
  description: String,
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  reply: [{ type: Schema.Types.ObjectId, ref: 'Reply' }],
  upvote: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  downvote: [{ type: Schema.Types.ObjectId, ref: 'User' }]
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post