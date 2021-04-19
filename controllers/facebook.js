const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const UserModel = require('../models/dbuser')


const FACEBOOK_CLIENT_ID = '278472443887839';
const FACEBOOK_CLIENT_SECRET = '3962cf6fab1acff57885f6586379d464';

passport.use(new FacebookStrategy ({
    clientID : FACEBOOK_CLIENT_ID,
    clientSecret : FACEBOOK_CLIENT_SECRET,
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