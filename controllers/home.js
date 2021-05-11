const mongoose = require('mongoose');
const CoursesModel = require('../models/dbcourses')
const CategoryModel = require('../models/dbcategory')
const CommentsModel = require('../models/dbcomments');
const LikeModel = require('../models/dblike');
const NotificationUserModel = require('../models/dbnotificationUser')
const NotificationModel = require('../models/dbnotification')
const { responseSuccess } = require('../response');

exports.index = async function(req, res){
    try{
        let data = await CoursesModel.find().populate('category')
        let dataMusic = data.filter(function(item) {
            return item.category[0].cate_name === 'Music'
        })
        let dataIT = data.filter(function(item) {
            return item.category[0].cate_name === 'IT'
        })
        let dataGame = data.filter(function(item) {
            return item.category[0].cate_name === 'Game'
        })
        res.render('index.ejs', {data, dataMusic, dataIT,dataGame })
    }
    catch(err){
        res.json(err)
    }  
}


exports.topicIT = async function(req, res){
    let query = {}
    if(req.query.course_name) {query.course_name = new RegExp(req.query.course_name)}
    let data = await CoursesModel.find(query).populate('category')
    data.user = req.session.User 
    //////////////////////////////
    let dataNoti = await NotificationModel.find().populate('course')
    let dataNotiUser = await NotificationUserModel.find({
        user : req.session.User
    })
    let countNoti = 0
    if(dataNotiUser.length == 0) countNoti = dataNoti.length 
    if(dataNotiUser.length > 0) {
        if(dataNotiUser.length == 1){
            countNoti = dataNoti.length - 1;
        }else if(dataNotiUser.length > 1){
            countNoti = dataNoti.length - dataNotiUser.length;
        }
    }
    res.render('topicIT.ejs', {data, dataNoti ,countNoti})
}

exports.topicMusic = async function(req, res){
    let query = {}
    if(req.query.course_name) {query.course_name = new RegExp(req.query.course_name)}
    let data = await CoursesModel.find(query).populate('category')
    data.user = req.session.User 
    ////////////////////////////
    let dataNoti = await NotificationModel.find().populate('course')
    let dataNotiUser = await NotificationUserModel.find({
        user : req.session.User
    })
    let countNoti = 0
    if(dataNotiUser.length == 0) countNoti = dataNoti.length 
    if(dataNotiUser.length > 0) {
        if(dataNotiUser.length == 1){
            countNoti = dataNoti.length - 1;
        }else if(dataNotiUser.length > 1){
            countNoti = dataNoti.length - dataNotiUser.length;
        }
    }
    res.render('topicMusic.ejs', {data,dataNoti,countNoti})
}

exports.topicGame = async function(req, res){
    let query = {}
    if(req.query.course_name) {query.course_name = new RegExp(req.query.course_name)}
    let data = await CoursesModel.find(query).populate('category')
    data.user = req.session.User 
    let dataNoti = await NotificationModel.find().populate('course')
    let dataNotiUser = await NotificationUserModel.find({
        user : req.session.User
    })
    let countNoti = 0
    if(dataNotiUser.length == 0) countNoti = dataNoti.length 
    if(dataNotiUser.length > 0) {
        if(dataNotiUser.length == 1){
            countNoti = dataNoti.length - 1;
        }else if(dataNotiUser.length > 1){
            countNoti = dataNoti.length - dataNotiUser.length;
        }
    }
    res.render('topicGame.ejs', {data,dataNoti,countNoti})
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
        let notiUser = await NotificationUserModel.findOne({
            course : req.params.id,
            user : req.session.User
        })
        if(!notiUser){
            await NotificationUserModel.create({
                course : req.params.id,
                user : req.session.User,
            })
        }
        // let dataNoti = await NotificationModel.find().populate('course')
        // let dataNotiUser = await NotificationUserModel.find({
        //     user : req.session.User
        // })
        // let countNoti;
        // if(countNoti > 0){
        //     if(dataNotiUser.length == 0) countNoti = dataNoti.length
        //     else if(dataNotiUser.length > 0) {
        //         if(dataNotiUser.length == 1){
        //             countNoti = dataNoti.length - 1;
        //         }else if(dataNotiUser.length > 1){
        //             countNoti = dataNoti.length - dataNotiUser.length;
        //         }
        //     }
        // }

        /****************************************************** */
        // if(dataNotiUser.length == 0) countNoti = dataNoti.length 
        // if(dataNotiUser.length > 0) {
        //     if(dataNotiUser.length == 1){
        //         countNoti = dataNoti.length - 1;
        //     }else if(dataNotiUser.length > 1){
        //         countNoti = dataNoti.length - dataNotiUser.length;
        //     }
        // }
        // res.render('detailCourse.ejs',{data, comment, liked, dataNoti , countNoti})
        res.render('detailCourse.ejs',{data, comment, liked})
    }
    catch (err) {
        res.json(err)
    }
    
}

exports.postComment = async function(req, res){
    try {
        let comment = await CommentsModel.create({
            content : req.body.content,
            user : req.session.User,
            course : req.params.id
        })
        res.redirect(`/detail/${comment.course}`)
    }
    catch (err) {
        res.json(err)
    }
    
}



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




