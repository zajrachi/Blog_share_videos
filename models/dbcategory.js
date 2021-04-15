const mongoose = require('mongoose')

const Schema = mongoose.Schema

const CategorySchema = new Schema({
    cate_name: String,

}, {
    collection: 'category'
})

const CategoryModel = mongoose.model('category', CategorySchema)

module.exports = CategoryModel