const mongoose = require('mongoose')
const Schema = mongoose.Schema
const replySchema = new Schema({
  body: String,
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  upvote: [{ type: Schema.Types.ObjectId, ref: 'User', unique: true }],
  downvote: [{ type: Schema.Types.ObjectId, ref: 'User' }]
})

const Reply = mongoose.model('Reply', replySchema)

module.exports = Reply