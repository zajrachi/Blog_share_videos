const mongoose = require('mongoose')

const Schema = mongoose.Schema

const AdminSchema = new Schema({
    log_name: String,
    pass: String,

}, {
    collection: 'admin'
})

const AdmintModel = mongoose.model('admin', AdminSchema)

module.exports = AdminModel