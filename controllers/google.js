const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const UserModel = require('../models/dbuser')

/*  Google AUTH  */
const GOOGLE_CLIENT_ID = '275162454535-v1odsqicv7kjvda7haold66nik3qo1lh.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = 'wUlTq2lQ1mIdJI-ow1vnf6vE';

// passport.serializeUser((user, done) => {
//     done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//     UserModel.findById(id).then((user) => {
//         done(null, user);
//     });
// });

passport.use(new GoogleStrategy(
    {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"},
    function(accessToken, refreshToken, profile, done) {
        if(profile.id){
            UserModel.findOne({username : profile.emails[0].value})
            .then((existingUser)=>{
                if(existingUser){
                    done(null, existingUser)
                }else{
                    UserModel.create({
                        username : profile.emails[0].value,
                        pass: profile.id,
                        isGoogle: true,
                        avatar : profile.photos[0].value,
                    })
                    .then(user => {
                        done(null, user)
                    }) 
                }
            })
        }
        // UserModel.findOrCreate({username : profile.emails[0].value},{
        //                     username : profile.emails[0].value,
        //                     pass: profile.id,
        //                     isGoogle: true,
        //                     avatar : profile.photos[0].value,
        //                  },function (err, user) {
        //                     return done(err, user);
        //                   })
    }
))
module.exports = passport;