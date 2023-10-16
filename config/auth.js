const ensureAuthenticated = (req,res,next)=>{
    if(req.isAuthenticated()){
        // req.isAuthenticated() will return true if user is logged in
        next(); // this signifies that this ia not the begninng or the end meaning that it is middleware
    } else {
        request.flash('error_msg', 'plrsdr login to view')
        res.redirect('/users/login');
    }
}



module.exports = {
    ensureAuthenticated
}

// ensureAithenticated varifys if the user has logged in, if they are logged in it will return true if they are logged out it will return false