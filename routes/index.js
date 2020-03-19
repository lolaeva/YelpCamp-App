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
    User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
        if(err){
            req.flash('error', err.message); // display the actual error
            return res.render("register", {"error": err.message}); // set err.message to error
        }
        passport.authenticate('local')(req,res, function() {
            req.flash('success', 'Welcome to Yelpcamp '+ user.username); 
            res.redirect('/campgrounds');
        });
    });
})

// Show login form
router.get('/login', (req, res) => {
    res.render('login');
});

// //handling login logic
// router.post('/login', function(req, res, next) {
//     passport.authenticate('local', function(err, user, info) {
//       if (err) { return next(err); }
//       if (!user) { return res.redirect('/login'); }
//       req.logIn(user, function(err) {
//         if (err) { return next(err); }
//         var redirectTo = req.session.redirectTo ? req.session.redirectTo : '/campgrounds';
//         delete req.session.redirectTo;
//         res.redirect(redirectTo);
//       });
//     })(req, res, next);
//   });

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


// ===========



module.exports = router;