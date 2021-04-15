const mongoose = require('mongoose')
const AdminModel = require('../models/dbadmin')
const CoursesModel = require('../models/dbcourses')
const CommentsModel = require('../models/dbcomments')
const CategoryModel = require('../models/dbcategory')
const NotificationModel = require('../models/dbnotification')
const response = require('../response')


exports.adminLogin = async function(req, res){
    let data = await AdminModel.findOne({
        log_name : req.body.log_name,
        pass : req.body.pass
    })
    if (data){
        req.session.User = data
        res.redirect('/adminHome')
    }else{
        res.status(400).json('Account does not exist')
    }
}

exports.goAdminLogin = function(req, res){
    res.render('adminLogin.ejs')
}


exports.goAdminHome = async function(req, res){
    try{ 
        let data = await CoursesModel.find({})
        data.admin = req.session.User;
        res.render('adminHome.ejs',{data: data})
    }
    catch (err) {
        res.json(err)
    }
}


exports.detailCourseAdmin = async function(req, res){
    try{
        let data = await CoursesModel.findOne({
            _id : req.params.id
        })
        let comment = await CommentsModel.find({
            course : req.params.id
        }).populate('user');
        data.admin = req.session.User
        res.render('detailCourseAdmin.ejs',{data: data, comment: comment})
    }
    catch (err) {
        res.json(err)
    }
    
}

exports.deleteComment = async function(req, res){
    try{
        let data = await CommentsModel.findOne({_id : req.params.commentId})
        await CommentsModel.findByIdAndDelete({_id : req.params.commentId})
        res.redirect(`/detailCourseAdmin/${data.course}`)
    }
    catch(err){
        res.json(err)
    }
}


exports.adminLogout = function(req, res){
    if (req.session.User && req.cookies.kim) {
        res.clearCookie('kim');
        res.redirect('/adminLogin');
    }
}


exports.addCourse = async function(req, res){
    try{
        let data = await CoursesModel.create({ 
            course_name : req.body.course_name, 
            course_des : req.body.course_des,
            course_date : req.body.course_date,
            course_url : req.body.course_url,
            course_img : req.body.course_img,
            course_like : req.body.course_like,
            category : req.body.category,
        })
        await NotificationModel.create({
            course : data._id ,
        })
        res.redirect('/adminHome')
    }
    catch(err){
        res.json(err)
    }
}

exports.goAddCourse = async function(req, res){
    let data = await CategoryModel.find({})
    res.render('adminAdd.ejs',{data: data})
}


exports.editCourse = async function(req, res){
    
    try{
        await CoursesModel.findByIdAndUpdate({_id : req.params.id},
            {
                course_name : req.body.course_name, 
                course_des : req.body.course_des,
                course_date : req.body.course_date,
                course_url : req.body.course_url,
                course_img : req.body.course_img,
                category : req.body.category,
            })
        
        res.redirect('/adminHome')
    }
    catch(err) {
        res.json(err)
    }
}

exports.goEditCourse = async function(req, res) {
    try{
        let data = await CoursesModel.findOne({
            _id : req.params.id
        })
        let dataCate = await CategoryModel.find({})
        res.render('adminEdit.ejs', {data : data, dataCate : dataCate})
    }
    catch(err){
        res.json(err)
    }
}


exports.deleteCourse = async function(req, res){
    try{
        await CoursesModel.findByIdAndDelete({_id: req.params.id})
        res.redirect('/adminHome')
    }
    catch(err){
        res.json(err)
    }
}