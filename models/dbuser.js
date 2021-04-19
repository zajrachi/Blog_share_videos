const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = new Schema({
    username : {type: String},
    pass : {type: String},
    avatar : {type: String, default: '/controllers/uploads/default-avatar.jpg'},
    isGoogle : {type: Boolean, default: false},
    isFacebook : {type: Boolean, default: false},
    // log_name : {type: String, default: 'none'},
    // email : {type: String, default: 'none'},
}, {
    collection: 'user'
})

const UserModel = mongoose.model('user', UserSchema)

module.exports = UserModel