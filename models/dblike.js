const mongoose = require('mongoose')

const Schema = mongoose.Schema

const LikeSchema = new Schema({
    course : [{ type: Schema.Types.ObjectId, ref: 'course' }],
    user : [{ type: Schema.Types.ObjectId, ref: 'user' }],

}, {
    collection: 'like'
})

const LikeModel = mongoose.model('like', LikeSchema)

module.exports = LikeModel