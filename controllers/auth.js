const mongoose = require('mongoose')
const CoursesModel = require('../models/dbcourses')
const UserModel = require('../models/dbuser')
const response = require('../response')


exports.login = async function(req, res){
    try{
        let data = await UserModel.findOne({
            log_name: req.body.log_name,
            pass : req.body.pass
        })
        req.session.User = data            
        res.redirect('/userLogin')
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
        let data = await CoursesModel.find({})
        data.user = req.session.User
        res.render('userLogin.ejs',{data:data})
    }
    catch(err){
        res.json(err)
    }
    
}


exports.register = async function(req, res){
    try{
        let data = await UserModel.findOne({
            log_name : req.body.log_name
        })
        if(data){
            res.status(400).json('Username was existed!')
        }else{
            UserModel.create({
                log_name: req.body.log_name,
                pass : req.body.pass,
                username : req.body.username,
                email: req.body.email,
            })
        }
        res.render('login.ejs')
    }
    catch (err) {
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
    }
}
