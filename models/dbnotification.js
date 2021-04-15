const mongoose = require('mongoose')

const Schema = mongoose.Schema

const NotificationSchema = new Schema({
    course : [{ type: Schema.Types.ObjectId, ref: 'courses' }],

}, {
    collection: 'notification'
})

const NotificationModel = mongoose.model('notification', NotificationSchema)

module.exports = NotificationModel