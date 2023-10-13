const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const morgan = require('morgan');
const passport = require('passport');
require("./config/passport")(passport);
require('dotenv').config();
const router = express.Router();
const app = express();
const mongoose = require('mongoose');
const expressEJSLayout = require('express-ejs-layouts');
const port = 3000



try{
    mongoose.connect(process.env.MONGO_URI, {useNewUrlParser:true,useUnifiedTopology:true})
    .then(()=>{console.log(`connected on Port: ${process.env.PORT}`)})
    .catch((err)=>{console.error(err)});
} catch(err){

}
// Devlopment tools
app.use(morgan('tiny'));
// EJS
app.set('view engine', 'ejs')
app.use(expressEJSLayout)
// Body parser
app.use(express.urlencoded({extended: false}));
// express session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true, 
    saveUninitialized: true
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