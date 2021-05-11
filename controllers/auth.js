const mongoose = require('mongoose')
const CoursesModel = require('../models/dbcourses')
const UserModel = require('../models/dbuser')
const LikeModel = require('../models/dblike')
const NotificationUserModel = require('../models/dbnotificationUser')
const NotificationModel = require('../models/dbnotification')
const response = require('../response')
const fileUpload = require('express-fileupload');
const express = require('express')
const app = express()

app.use(fileUpload());
app.use("/controllers/uploads", express.static(__dirname + '/uploads'));

exports.login = async function(req, res){
    
    try{
        let data = await UserModel.findOne({
            username: req.body.username,
            pass : req.body.pass,
        })
        if(data){
            req.session.User = data       
            res.redirect('/userLogin')
        }else{
            res.status(400).json('User not exist')
        }
    }
    catch(err){
        res.json(err)
    }  
}

exports.goLogin = function(req, res){
    res.render('login.ejs')
}

exports.goUserLogin = async function(req, res){
    try{
        let data = await CoursesModel.find().populate('category')
        data.user = req.session.User
        let dataMusic = data.filter(function(item) {
            return item.category[0].cate_name === 'Music'
        })
        let dataIT = data.filter(function(item) {
            return item.category[0].cate_name === 'IT'
        })
        let dataGame = data.filter(function(item) {
            return item.category[0].cate_name === 'Game'
        })
        let dataNoti = await NotificationModel.find().populate('course')
        let dataNotiUser = await NotificationUserModel.find({
            user : req.session.User
        })
        let countNoti = 0
        if(dataNotiUser.length == 0) countNoti = dataNoti.length 
        if(dataNotiUser.length > 0) {
            // if(dataNotiUser.length == 1){
            //     countNoti = dataNoti.length - 1;
            // }else if(dataNotiUser.length > 1){
            //     countNoti = dataNoti.length - dataNotiUser.length;
            // }
            countNoti = dataNoti.length - dataNotiUser.length;
        }
        res.render('userLogin.ejs', {
            data,
            dataMusic,
            dataIT,
            dataGame,
            countNoti,
            dataNoti
        });
    }
    catch(err){
        res.json(err)
    }
    
}



exports.register = async function(req, res){
    try{
        let data = await UserModel.findOne({
            username : req.body.username
        })
        if(data){
            res.status(400).json('Username was existed!')
        }else{
            let sampleFile
            let uploadPath
            let path
            
            if(req.files){
                sampleFile = req.files.avatar
                uploadPath = __dirname + '/uploads/'+sampleFile.name
                path = '/controllers/uploads/'+sampleFile.name
                sampleFile.mv(uploadPath, function(err){
                    if(err){
                        return res.status(500).send(err)
                    }
                })
                
            }
            await UserModel.create({
                username : req.body.username,
                pass : req.body.pass,
                avatar : path,
            })
            res.status(200).json(true)
        }    
    }
    catch (err) {
        console.log(err)
        res.json(err)
    }
}

exports.goRegister = function(req, res){
    res.render('register.ejs')
  };


exports.logout = async function(req, res){
    if (req.session.User && req.cookies.kim) {
        res.clearCookie('kim');
        res.redirect('/');
    }else {
        res.redirect('/');
    }
}


exports.userProfile = async function(req, res){
    try{
        let data = await UserModel.findOne({ _id : req.session.User._id})
        let courseLike = await LikeModel.find({user : data._id}).populate('course');
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
        res.render('userProfile.ejs',{data, courseLike, countNoti , dataNoti})
    }
    catch(err) {
        res.json(err)
    }
}

exports.deleteCourseLiked = async function(req, res){
    try{
        let data = await CoursesModel.findOne({ _id : req.params.likedId})
        await LikeModel.findOneAndDelete({course : data._id}).populate('course');
        res.redirect('/userProfile')
    }
    catch(err) {
        res.json(err)
    }
}

exports.updateProfile = async function(req, res){
    try{
        let sampleFile
        let uploadPath
        let path
            
        if(req.files){
            sampleFile = req.files.avatar
            uploadPath = __dirname + '/uploads/'+sampleFile.name
            path = '/controllers/uploads/'+sampleFile.name
            sampleFile.mv(uploadPath, function(err){
                if(err){
                    return res.status(500).send(err)
                }
            })
            
            await UserModel.findByIdAndUpdate({_id : req.session.User._id},{
                avatar : path,
                // username : req.body.username,
                // email : req.body.email,
            })
        }
        res.json(true)
    }
    catch(err) {
        res.json(err)
    }
}

exports.goUpdateProfile = async function(req, res){
    let data = await UserModel.findOne({_id : req.session.User})
    res.render('userProfileUpdate.ejs',{data: data})
}