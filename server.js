const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose')
const home = require('./controllers/home')
const auth = require('./controllers/auth')
const bodyParser = require('body-parser')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const app = express();


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




mongoose.connect('mongodb://localhost/blog_course', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})



app.get('/', home.index)
app.get('/detail/:id', home.detail)
app.get('/likeCourse/:courseId',home.likeCourse)
// app.get('/likeCourse',home.goLikeCourse)
app.get('/login',auth.goLogin)
app.post('/login',auth.login)
app.get('/userLogin',auth.goUserLogin)
app.post('/register',auth.register)
app.get('/register',auth.goRegister)
app.get('/logout', auth.logout)
app.post('/postComment',home.postComment)
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started on  port: http://localhost:${port}/`)
})

