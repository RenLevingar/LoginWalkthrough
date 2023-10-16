const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const morgan = require('morgan');
const passport = require('passport'); // Passport docs: https://www.passportjs.org/docs/
require("./config/passport")(passport); // this isnt a variable because it already has access to the file and thus because it is already being stored it doesnt need to be used
require('dotenv').config(); // this sets up enviormental variables and is necessary for process.env and will find the .env file in the program
const router = express.Router();
const app = express();
const mongoose = require('mongoose');
const expressEJSLayout = require('express-ejs-layouts');
const port = 3000;



try{ // this is done in this file because the app.js is the main point our program starts from and evertything in this file trickles into every other program
    mongoose.connect(process.env.MONGO_URI, {useNewUrlParser:true,useUnifiedTopology:true})
    .then(()=>{console.log(`connected on Port: ${process.env.PORT}`)})
    .catch((err)=>{console.error(err)});
} catch(err){

}
// Devlopment tools
app.use(morgan('tiny')); // posting all requests in the terminal
// EJS
app.set('view engine', 'ejs')
app.use(expressEJSLayout) // helps with rendering
// Body parser
app.use(express.urlencoded({extended: false})); // how the req.body is formated
// express session
app.use(session({ 
    secret: process.env.SESSION_SECRET, // unique secret name for access to any session
    resave: true, 
    saveUninitialized: true // if they try to make a session it will ONLY disapear when they are fully done with the session
}));
app.use(passport.initialize());
app.use(passport.session());
// use flash messaging---Express
app.use(flash());
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next()
})
// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));



app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
// app.listen(process.env.PORT || 3000); // this will go based off of what is set in process.env, if there is not port set then it will use port 3000