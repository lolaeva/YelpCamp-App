// ==============
// COMMENTS ROUTE
// ==============

// Express router
const express = require('express'),
      router  = express.Router({mergeParams: true}), // nested routes     
      Campground = require('../models/campground'),
      Comment = require('../models/comment'),
      middleware = require('../middleware') // automatically require index.js because it's special name

// New comments
router.get('/new', middleware.isLoggedIn, (req, res) => {
    //find campground with that ID
    Campground.findById(req.params.id, (err, foundCampground) =>{
        if(err || !foundCampground){
            req.flash('error', 'Campground not found');
            res.redirect('back')
        } else {
            //render show template with comment associated with that campground
            res.render('comments/new', {campground: foundCampground});
        }
    });
});

// Create comments
router.post('/', middleware.isLoggedIn, (req, res) => {
    // lookup campground using ID
    Campground.findById(req.params.id, (err, campground) =>{
        if(err){
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            // create new comment
            Comment.create(req.body.comment,(err, comment) =>{
                if(err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id
                    comment.author.username = req.user.username
                    // save comment
                    comment.save();
                    // connect new comment to campground
                    // redirect to campground show page
                    campground.comments.push(comment)
                    campground.save()
                    console.log(comment);
                    req.flash("success", "Successfully added comment");
                    res.redirect('/campgrounds/' + campground._id)
                }
            });   
        }
    });
});

// EDIT comments
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
    Campground.findById(req.params.id, (err,foundCampground)=> {
        if(err || !foundCampground){
            req.flash('error', 'Campground not found');
            return res.redirect('back');
        } 
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err){
                res.redirect('back');
            } else {
                res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
            }
        });    
    })
});

// UPDATE comments ROUTE
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if(err){
            res.redirect('back')
        } else {
            res.redirect('/campgrounds/' + req.params.id)
        }
    });
});

// DESTROY ROUTE
router.delete('/:comment_id', middleware.checkCommentOwnership,  (req,res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if(err){
            res.redirect('back');
        } else {
            req.flash("success", "Comment deleted");
            res.redirect('/campgrounds/' + req.params.id);
        }
    })
});


module.exports = router;

// ==============