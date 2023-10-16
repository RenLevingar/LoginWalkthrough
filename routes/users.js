const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user');


// Login page
router.get('/login', (req,res)=>{
    res.render('pages/login');
})

// Register page
router.get('/register', (req,res)=>{
    res.render('pages/register');
})

// Register Handle
router.post('/register', async(req,res)=>{
    const {first_name, last_name, email, password, password2} = req.body; //pulls out all the needed info
    let errors = [];
    // console.log(first_name + " " + last_name + " " + email + " " + password + " " + password2)
    if(!first_name || !last_name || !email || !password || !password2){ // this makes sure all the fields have info
        errors.push({msg: 'please fill in all feilds'});
    }
    // check if  the passwords match
    if(password != password2){
        errors.push({msg: "Passwords dont match"}) // if they dont match then it will be sent to errors,  but wont be printed on the screen
    }

    // the following is an example of ways you can be more specfic and make more of your own rules in your code
    // check if password is less than 6 characters
    if(password.length < 6){
        errors.push({msg: "Password at least 6 characters must"}) // if the password isn't long enough this will be pushed to errors
    }

    // checks to see if there are any errors at all
    if(errors.length > 0){ // this should work by just checking if anything exists in the errors array: if(errors)
        res.render('pages/register', { // this doesn't display the errors but sends them to the register page as an object
            errors: errors, // this is the array of all of the errors
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: password})
    } else {
        // validation passed
        console.log(email)
        let user = await User.findOne({email : email})
            console.log(user);
            if(user) { // this only runs if the user already exists when being made
                errors.push({msg: 'email is already registerd'});
                console.log(errors + "1")
                res.render('pages/register', 
                {errors:errors, first_name:first_name, last_name:last_name, email:email, password:password, password2:password2});

            } else { // this runs if the user does exist
                console.log(errors + "2");
                const newUser = new User({
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    password: password
                });
                // hash password
                bcrypt.genSalt(10, (err, salt) => // begins password encryption 
                bcrypt.hash(newUser.password,salt, 
                    (err,hash)=> {
                        if(err) throw err;
                            // save pass to hash
                            newUser.password = hash; // hash = the encrypted password
                        // save user
                        newUser.save() // this is specifically a mongoose function to save the user information to the mongodb database
                        .then((value)=>{ // value is the new user object
                            // console.log(value)
                            req.flash('success_msg', "You are now registered!")
                            res.redirect('/users/login');
                        })
                        .catch(value=> console.log(value));

                    }))
            }
    }
})
// Login
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect: '/dashboard', // if they authenticated correctly they go to the dashboard
        failureRedirect: '/users/login', // if they fail they go to the login page
        failureFlash: true,  // this means that failure messages will pop up
    })(req,res,next);
})

// Logout
router.get('/logout', (req,res)=>{
    req.logout(function(err) { // if there is an error the user will stay on the same page
        if(err) {return next(err); }
    })
    res.redirect('/') // if there is no error the user will be redirected to the home page
})


module.exports = router;