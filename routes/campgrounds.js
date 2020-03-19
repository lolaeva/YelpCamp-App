// =================
// CAMPGROUNDS ROUTE
// =================

// Express router
const express = require('express'),
      router  = express.Router(),
      Campground = require('../models/campground'),
      middleware = require('../middleware') // automatically require index.js because it's special name


// INDEX ROUTE - show all campgrounds
router.get('/', (req, res) => {
    // Pagination configuration
    var perPage = 8,
        pageQuery = parseInt(req.query.page),
        pageNumber = pageQuery ? pageQuery : 1;
    // get all campgrounds from DB
    Campground.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allCampgrounds) {
        Campground.countDocuments().exec(function (err, count) {
            if(err){
                console.log(err);
            } else {
                res.render('campgrounds/index', {
                    campgrounds: allCampgrounds,
                    current: pageNumber,
                    pages: Math.ceil(count / perPage)
                });
            }
        })
    })
});

// CREATE ROUTE - add new campground to database
router.post('/', middleware.isLoggedIn, (req, res) => {
    var name = req.body.name,
        image = req.body.image,
        desc = req.body.description,
        price = req.body.price,
        author = { id: req.user._id, username: req.user.username},
        newCampground = {name: name, image: image, description: desc, price: price, author:author}
    //create a new campground and SAVE TO DATABASE
    Campground.create(newCampground, (err, newlyCreated) =>{
        if(err){
            console.log(err);
        } else {
                // redirect back to campgrounds page
                // note: even though there are 2 /campgrounds, the deafult redirect is get request
                console.log(newlyCreated);
                req.flash("success", "Successfully added campground");
                res.redirect('/campgrounds');
        }
    });
});

// NEW ROUTE - show the form that sends the data to the post route
router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

// SHOW ROUTE - show info about one campground
router.get('/:id', (req, res) => {
    //find campground with that ID
    Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) =>{
        if(err || !foundCampground){
            req.flash('error', 'Campground not found');
            res.redirect('back');
        } else {
            //render show template with that campground
            res.render('campgrounds/show', {campground: foundCampground});
        }
    });
});

// EDIT ROUTE
router.get('/:id/edit', middleware.checkCampOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render('campgrounds/edit', {campground: foundCampground});
    });
});

// UPDATE ROUTE
router.put('/:id', middleware.checkCampOwnership, (req, res) => {
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if(err){
            res.redirect('/campgrounds')
        } else {
            //redirect to show page
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

// DESTROY ROUTE
router.delete('/:id', middleware.checkCampOwnership, (req,res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if(err){
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds');
        }
    })
});

module.exports = router;

// =================