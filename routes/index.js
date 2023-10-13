const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

const user = {
    firstName: 'Ren',
    lastName: 'Lev',

}
// homepage page
router.get('/', (req,res)=>{
    res.render('pages/index', {
        user: user // example of how to pass through data
    })
})
// //  register page
// router.get('/register', (req,res)=>{
//     res.render('register')
// })

// dashboard-Homapage Redirect
router.get('/dashboard', ensureAuthenticated,(req,res) => {
    res.render('dashboard', {
        user: req.user
    });
})

module.exports = router;