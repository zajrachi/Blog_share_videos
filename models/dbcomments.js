const mongoose = require('mongoose')

const Schema = mongoose.Schema

const CommentsSchema = new Schema({
    content: String,
    date: { type: Date , default: Date.now},
    course_url: String,
    like: { type: Number},
    dislike: { type: Number},
    course : [{ type: Schema.Types.ObjectId, ref: 'courses' }],
    user : [{ type: Schema.Types.ObjectId, ref: 'user' }]

}, {
    collection: 'comments'
})

const CommentsModel = mongoose.model('comments', CommentsSchema)

module.exports = CommentsModel