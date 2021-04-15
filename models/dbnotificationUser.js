const mongoose = require('mongoose')

const Schema = mongoose.Schema

const NotificationUserSchema = new Schema({
    course : [{ type: Schema.Types.ObjectId, ref: 'notification' }],
    user : [{ type: Schema.Types.ObjectId, ref: 'user' }],
    // status : {type : Number},

}, {
    collection: 'notification_user'
})

const NotificationUserModel = mongoose.model('notification_user', NotificationUserSchema)

module.exports = NotificationUserModel