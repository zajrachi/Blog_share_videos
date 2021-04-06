const mongoose = require('mongoose');
const CoursesModel = require('../models/dbcourses')
const CommentsModel = require('../models/dbcomments');
const LikeModel = require('../models/dblike');
const { responseSuccess } = require('../response');

exports.index = async function(req, res){
    try{
        let data = await CoursesModel.find()
        res.render('index.ejs', {data: data})
    }
    catch(err){
        res.json(err)
    }  
}


exports.detail = async function(req, res){
    try{
        let data = await CoursesModel.findOne({
            _id : req.params.id
        })
        let comment = await CommentsModel.find({
            course : req.params.id
        }).populate('user');
        data.user = req.session.User
        let liked = await LikeModel.findOne({ 
            user : req.session.User,
            course : req.params.id
        }) 
        res.render('detailCourse.ejs',{data: data, comment: comment,liked :liked})
    }
    catch (err) {
        res.json(err)
    }
    
}

exports.postComment = async function(req, res){
    try {
        await CommentsModel.create({
            content : req.body.content,
            user : req.session.User,
            course : req.body.course
        })
        res.json(true)
    }
    catch (err) {
        res.json(err)
    }
    
}

// exports.likeCourse = async function (req, res){
//     try {
//         let course = await CoursesModel.findOne({ _id: req.params.id });
//         course.course_like = course.course_like += 1
//         await course.save();
//         res.redirect(`/detail/${req.params.id}`)
//         // res.render('detailCourse.ejs')
//     }
//     catch (err) {
//         res.json(err)
//     }
// }


exports.likeCourse = async function(req, res){ 
    try {
        let like = await LikeModel.create({
            user : req.session.User,
            course : req.params.courseId
        })
        let course = await CoursesModel.findOne({ _id: req.params.courseId });
        course.course_like = course.course_like += 1
        await course.save();
        res.redirect(`/detail/${req.params.courseId}`)
    }
    catch(err) {
        res.json(err)
    }
}




