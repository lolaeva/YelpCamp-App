// Express router
const express    = require('express'),
      router     = express.Router(),
      Campground = require('../models/campground'),
      Comment    = require('../models/comment'),
      passport   = require('passport'),
      User       = require('../models/user'),
      middleware = require('../middleware') // automatically require index.js because it's special name

// Root route
router.get('/', (req, res) => {
    res.render('landing')
})

// ===========
// AUTH ROUTES
// ===========

// Show signup form
router.get('/register', (req, res) => {
    res.render('register');
});

// handle signup logic
router.post('/register', (req, res) => {
    var newUser = new User ({
        username: req.body.username,
        email: req.body.email,
        avatar: req.body.avatar
    });
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            req.flash('error', err.message); // display the actual error
            return res.render("register", {"error": err.message}); // set err.message to error
        }
        passport.authenticate('local')(req,res, function() {
            req.flash('success', 'Successfully signed up! Welcome '+ user.username); 
            res.redirect('/campgrounds');
        });
    });
})

// Show login form
router.get('/login', (req, res) => {
    res.render('login');
});

// Handle login logic. passport.authenticate is middleware
router.post('/login', passport.authenticate('local', 
    {
        successReturnToOrRedirect: '/campgrounds',
        failureRedirect: '/login',
        successFlash: "Welcome ", // add username in header ejs
        failureFlash: true
    }), (req, res) => {
});

// logout route
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Successfully logged out');
    res.redirect('/')
});

// USERS PROFILE
router.get('/users/:id', (req, res) => {
    User.findById(req.params.id, (err, foundUser) =>{
        if(err){
            req.flash('error', 'Something went wrong');
            res.redirect('back');
        }
        Campground.find().where('author.id').equals(foundUser._id).exec((err, campgrounds) =>{
            if(err){
                req.flash('error', 'Something went wrong');
                res.redirect('back');
            } 
            res.render('users/show', {user: foundUser, campgrounds: campgrounds});
        })
    });
});


// ===========



module.exports = router;