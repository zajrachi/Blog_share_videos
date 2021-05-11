const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const UserModel = require('../models/dbuser')
const keys = require('../key')

/*  Google AUTH  */

passport.use(new GoogleStrategy(
    {
    clientID: keys.GOOGLE_CLIENT_ID,
    clientSecret: keys.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"},
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
    }
))
module.exports = passport;