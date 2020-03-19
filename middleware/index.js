var Comment = require('../models/comment'),
    Campground = require('../models/campground')

// All middleware goes here
var middlewareObj = {}

middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
    // before redirect display flash message. Handle this in /login
    req.flash("error", "You need to be logged in or sign up to do that"); 
    res.redirect('/login');
    }
}

middlewareObj.checkCampOwnership = function (req, res, next){
    // is user logged in
    if(req.isAuthenticated()){
        // otherwise, redirect
        Campground.findById(req.params.id, (err, foundCampground) => {
            if(err || !foundCampground){
                req.flash("error", "Campground not found");
                res.redirect('back')
            } else {
                // does the user own the campground
                if(foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect('back')
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in or sign up to do that");
        // if not, redirect
        res.redirect('back')
    }
}

middlewareObj.checkCommentOwnership = function (req, res, next){
    // is user logged in
    if(req.isAuthenticated()){
        // otherwise, redirect
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err || !foundComment){
                req.flash("error", "Comment not found");
                res.redirect('back')
            } else {
                // does the user own the campground
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect('back')
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in or sign up to do that");
        // if not, redirect
        res.redirect('back')
    }
}

module.exports = middlewareObj;