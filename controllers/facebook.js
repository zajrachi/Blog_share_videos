const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const UserModel = require('../models/dbuser')
const keys = require('../key')



passport.use(new FacebookStrategy ({
    clientID : keys.FACEBOOK_CLIENT_ID,
    clientSecret : keys.FACEBOOK_CLIENT_SECRET,
    callbackURL : "/auth/facebook/callback"
    },
    function (accessToken,refreshToken,profile,done) {
        if(profile.id){
            UserModel.findOne({username : profile.displayName})
            .then((existingUser)=>{
                if(existingUser){
                    done(null, existingUser)
                }else{
                    UserModel.create({
                        username: profile.displayName,
                        pass: profile.id,
                        isFacebook : true,
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