const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user');


//login handler
router.get('/pages', (req,res)=>{
    res.render('login');
})
router.get('/pages', (req,res)=>{
    res.render('Register');
})

// Register Handle
router.post('/register', (req,res)=>{
    const {first_name, last_name, email, password, password2} = req.body;
    let errors = [];
    // console.log(first_name + " " + last_name + " " + email + " " + password + " " + password2)
    if(!first_name || !last_name || !email || !password || !password2){
        errors.push({msg: 'please fill in all feilds'});
    }
    // check if match
    if(password != password2){
        errors.push({msg: "Passwords dont match"})
    }

    // check if password is less than 6 characters
    if(password.length < 6){
        errors.push({msg: "Password at least 6 characters must"})
    }
    if(errors.length > 0){
        res.render('register', {
            erros: erros,
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: password})
    } else {
        // validation passed
        User.findOne({email:email}).then((err,user)=>{
            // console.log(user);
            if(user) {
                errors.push({msg: 'email is already registerd'});
                res.render(errors, first_name, last_name, email, password, password2);

            } else {
                const newUser = new User({
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    password: password
                });
                // hash password
                bcrypt.genSalt(10, (err, salt) => 
                bcrypt.hash(newUser.password,salt, 
                    (err,hash)=> {
                        if(err) throw err;
                            // save pass to hash
                            newUser.password = hash;
                        // save user
                        newUser.save()
                        .then((value)=>{
                            // console.log(value)
                            req.flash('success_msg', "You are now registered!")
                        req.redirect('/users/login');
                        })
                        .catch(value=> console.log("value: yayyy"));

                    }))
            }
        })
    }
})
// Login
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true,
    })(req,res,next);
})

// Logout
router.get('/logout', (req,res)=>{
    req.logout(function(err) {
        if(err) {return next(err); }
    })
    res.redirect('/')
})


module.exports = router;