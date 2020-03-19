// REQUIRING PACKAGES AND MODELS
const bodyParser     = require('body-parser'),
      express        = require('express'),
      expressSanitizer = require('express-sanitizer'),
      expressSession = require('express-session'),
      flash          = require('connect-flash'), // flash messages
      mongoose       = require('mongoose'),
      methodOverride = require('method-override'),
      LocalStrategy  = require('passport-local'),
      passport       = require('passport'),
      passportLocalMongoose = require('passport-local-mongoose'),
      request        = require('request'),
      rp             = require('request-promise'),
      Campground     = require('./models/campground'),
      Comment        = require('./models/comment'),
      seedDB         = require('./seeds'),
      User           = require('./models/user'),
      app            = express();

// REQUIRING ROUTES
const indexRoutes      = require('./routes/index'),
      campgroundRoutes = require('./routes/campgrounds'),
      commentRoutes    = require('./routes/comments');

// APP CONFIG
var url = process.env.DATABASEURL || 'mongodb://localhost/yelp_camp_v12'
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.connect('mongodb+srv://lolaeva:Todoslocos1@cluster0-ysxdf.mongodb.net/yelp_camp?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false); // to prevent deprecation warning
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer('express-sanitizer'));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
app.set('view engine', 'ejs');
// seedDB(); // Seed the database

// PASSPORT CONFIG
app.use(expressSession ({
    secret: 'This is secret setup',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ADD CURRENTUSER AND FLASH TO EVERY ROUTE (SHORT WAY)
app.locals.moment = require('moment'); // moment is available for use in all of your view files via the variable named moment
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success')
    next();
});

// EXPRESS ROUTING
app.use("/", indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

//all other request go to error page
app.get('*', (req, res) => {
	res.render('error')
});

app.listen(process.env.PORT || 3000, function(){
    console.log('app running at port 3000...');
   });
   