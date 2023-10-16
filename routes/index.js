const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

const user = {
    firstName: 'Ren',
    lastName: 'Lev',

}
// homepage page
router.get('/', (req,res)=>{ // makes the base of the direction if the user/ client is only directed to the home page
    res.render('pages/welcome', {
        user: user // example of how to pass through data
    })
})
// //  register page
// router.get('/register', (req,res)=>{
//     res.render('register')
// })

// dashboard-Homapage Redirect
router.get('/dashboard', ensureAuthenticated,(req,res) => { // runs the ensure authenticated function when the user tries to go to the dashboard page
    res.render('pages/dashboard', {
        user: req.user
    });
})

module.exports = router;