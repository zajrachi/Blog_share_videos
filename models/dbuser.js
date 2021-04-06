const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = new Schema({
    log_name: String,
    pass: String,
    username: String,
    email: String

}, {
    collection: 'user'
})

const UserModel = mongoose.model('user', UserSchema)

module.exports = UserModel