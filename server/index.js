//sets environmental variables... should happen before anything else
require('./controllers/env.js').set();

var db = require("./controllers/db.js");

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

/* controllers */
var site = require('./controllers/site');

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


/* login routes */
app.get( '/login', site.login );
app.post( '/login', passport.authenticate('local'), site.loginSuccess, site.loginFailure );
app.get( '/logout', site.logoutUser );
app.get( '/register', site.register );
app.post( '/register', site.registerUser, passport.authenticate('local'), site.loginSuccess, site.registerFailure );

/* money route */
app.get( '/', site.index );

//app.get( '/adminOnly', ensureUser, ensureAdmin, site.admin );

//app.use( '/userOnly', ensureUser, site.user );

//app.get( '/systemAdmin/add/:id', ensureAuthenticated, site.addSytemAdmin );
//app.get( '/systemAdmin/delete/:id', ensureAuthenticated, site.addSytemAdmin );

/*
// session tests

app.use(function( req, res, next ) {
   var views = req.session.views;

   console.log(views);

   if( !views ) {
      views = req.session.views = {};
   }

   var pathname = url.parse(req.url).pathname;

   views[pathname] = ( views[pathname] || 0 ) + 1;

   next();
});

app.get('/count', function( req, res, next) {
   res.send('you viewed this page ' + req.session.views['/count'] + ' times');
});

*/


/* if no path already responded, assume 404 */
app.use(function(req, res, next) {
   res.status(404).render('404', { url: req.originalUrl });
});

app.listen(3000, function() {
   console.log('listening on port 3000');
});

module.exports = app;
