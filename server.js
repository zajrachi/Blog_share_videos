const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose')
const UserModel = require('./models/dbuser')
const CoursesModel = require('./models/dbcourses')
const CategoryModel = require('./models/dbcategory')
const NotificationModel = require('./models/dbnotification')
const NotificationUserModel = require('./models/dbnotificationUser')
const home = require('./controllers/home')
const auth = require('./controllers/auth')
const admin = require('./controllers/admin')
const passport = require('passport')
const passportGoogle = require('./controllers/google')
const passportFacebook = require('./controllers/facebook')
const bodyParser = require('body-parser')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload');
require('dotenv').config();

const app = express();

app.use(fileUpload());
app.use(express.static(__dirname + '/public' ));
app.use("/controllers/uploads", express.static(__dirname + '/controllers/uploads'));


app.use(cookieParser());
app.use(session({
    key: 'kim',
    secret: 'kim',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60*60*24*365
    }
}));

app.use((req, res, next) => {
    if (req.cookies.kim && !req.session.User) {
        res.clearCookie('kim');        
    }
    next();
});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, cb) {
    cb(null, user);
}); 
passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});

mongoose.connect('mongodb://kim:12345678@3.1.211.199:27017/kim', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})

//*********************Route GG******************************** */
app.get('/auth/google', passportGoogle.authenticate('google', { scope : ['profile', 'email'], prompt: 'select_account consent' }));
app.get('/auth/google/callback', passportGoogle.authenticate('google'),
  async function(req, res) {
    if(req.user.isGoogle == true ) {
        req.session.User = req.user
        res.redirect('/userLogin')
    }
});
//***********************Route FaceBook*************************************** */
app.get('/auth/facebook', passportFacebook.authenticate('facebook', { authType: 'reauthenticate' }));
app.get('/auth/facebook/callback', passportFacebook.authenticate('facebook'),
async function(req, res) {
  if(req.user.isFacebook == true ) {
    req.session.User = req.user
    res.redirect('/userLogin')
  }
});
//**************************************************************** */

app.get('/', home.index)
app.get('/topicIT',home.topicIT)
app.get('/topicMusic',home.topicMusic)
app.get('/topicGame',home.topicGame)
app.get('/detail/:id', home.detail)
app.get('/likeCourse/:courseId',home.likeCourse)
app.get('/login',auth.goLogin)
app.post('/login',auth.login)
app.get('/userLogin',auth.goUserLogin)
app.get('/userProfile', auth.userProfile)
app.get('/deleteCourseLiked/:likedId',auth.deleteCourseLiked)
app.post('/updateProfile', auth.updateProfile)
// app.get('/updateProfile', auth.goUpdateProfile)
app.post('/register',auth.register)
app.get('/register',auth.goRegister)
app.get('/logout', auth.logout)
app.post('/adminLogin',admin.adminLogin)
app.get('/adminLogin',admin.goAdminLogin)
app.get('/adminHome',admin.goAdminHome)
app.get('/adminHome/:page',admin.goAdminPage)
app.get('/detailCourseAdmin/:id', admin.detailCourseAdmin)
app.get('/adminLogout', admin.adminLogout)
app.post('/addCourse', admin.addCourse)
app.get('/addCourse', admin.goAddCourse)
app.post('/editCourse/:id',admin.editCourse)
app.get('/editCourse/:id',admin.goEditCourse)
app.get('/deleteCourse/:id',admin.deleteCourse)
app.get('/deleteComment/:commentId',admin.deleteComment)
app.post('/postComment',home.postComment)
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started on  port: http://localhost:${port}/`)
})

