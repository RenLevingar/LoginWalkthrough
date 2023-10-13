const ensureAuthenticated = (req,res,next)=>{
    if(req.isAuthenticated()){
        // req.isAuthenticated() will return true if user is logged in
        next();
    } else {
        request.flash('error_msg', 'plrsdr login to view')
        res.redirect('/users/login');
    }
}



module.exports = {
    ensureAuthenticated
}