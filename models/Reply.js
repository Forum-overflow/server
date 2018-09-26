const mongoose = require('mongoose')
const Schema = mongoose.Schema
const replySchema = new Schema({
  body: String,
  post: { type: Schema.Types.ObjectId, ref: 'Post' },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  upvote: [{ type: Schema.Types.ObjectId, ref: 'User'}],
  downvote: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, {
  timestamps: true
})

const Reply = mongoose.model('Reply', replySchema)

module.exports = Reply