//sets environmental variables... should happen before anything else
//require('./controllers/env.js').set();

var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var url = require('url');

/* passport */
var passport = require('passport');
var userAuthentication = require('./controllers/authentication').userAuthentication;
var ensureAuthenticated = require('./controllers/authentication').ensureAuthenticated;
passport.use( userAuthentication );

var app = express();
var sessionOptions = {
   secret: 'a test secret',
   resave: false,
   saveUninitialized: true,
   // if we are running in production, only serve secure cookies
   // $export NODE_ENV=production, defaults to development
   cookie: { secure: ( app.get('env') === 'production' ) }
};

/* general configuration */
app.set('view engine', 'jade')
   .set('views', __dirname + '/views');


/* serves static files with the /static prefix: /static/css.main.css */
app.use('/static', express.static(__dirname + '/build/static'))
   // uses node querystring instead of qs
   .use(bodyParser.urlencoded({ extended: false })) 
   .use(session(sessionOptions))
   .use(passport.initialize())
   .use(passport.session());


// routes
var routes = require('./routes');
var login = require('./routes/login');

app.use( '/', login );
app.use( '/', routes );

// if an error was thrown with next, catch it here
app.use( function( err, req, res, next ) {

   console.log('logging an error: ' + err);
   res.status(500).send({ error : err });
});

app.use( function(req, res, next) {
   res.status(404).render('404', { url: req.originalUrl });
});

app.listen( 3000, function() {
   console.log('listening on port 3000');
});

module.exports = app;
