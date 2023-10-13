const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user')


    module.exports = function(passport) {
        passport.use(
            //'SELECT' * FROM users WHERE username = ?', [ username ], function(err, user) 
            new LocalStrategy({usernameField : 'email', passwordField : 'password', passReqToCallback : false, session:true},(email,password,done) => {
                console.log('Local Strat Works')
                // match user
                User.findOne({email: email})
                .then((user)=>{
                    if(!user) {
                        return done(null,false,{message : 'no email'})
                    }
                    // match pass
                    bcrypt.compare(password,user.password,(err,isMatch)=>{
                        if(err) throw err;

                        if(isMatch){
                            console.log(email + "" + password)
                            return done(null,user);
                        } else {
                            return done(null, false, {message: 'pass incorrect'})
                        }
                    })
                })
                .catch((err)=> {console.log(err)})
            })
        
        )




        //These are to handle the login sessions
        passport.serializeUser(function(user, done){
            done(null, user.id);
        });

        passport.deserializeUser(function(id, done){
            User.findById(id).then( (err,user)=>{
                done(user,err)
            });
        });
    }