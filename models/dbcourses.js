const mongoose = require('mongoose')

const Schema = mongoose.Schema

const CoursesSchema = new Schema({
    course_name: String,
    course_des: String,
    course_date: { type: Date},
    course_url: String,
    course_like: {type : Number},
    course_img : String,
    comment : [{ type: Schema.Types.ObjectId, ref: 'comments' }],

}, {
    collection: 'courses'
})

const CoursesModel = mongoose.model('courses', CoursesSchema)

module.exports = CoursesModel