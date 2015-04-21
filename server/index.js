var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var url = require('url');

/* controllers */
var site = require('./controllers/site');
var user = require('./controllers/user');

var authentication = require('./controllers/authentication');

var app = express();
var sessionOptions = {
   secret: 'a test secret',
   resave: false,
   saveUninitialized: true,
   // if we are running in production, only serve secure cookies
   // $export NODE_ENV=production, defaults to development
   cookie: { secure: !!( app.get('env') === 'production' ) }
};

/* general configuration */
app.set('view engine', 'jade')
   .set('views', __dirname + '/views');


/* serves static files with the /static prefix: /static/css.main.css */
app.use('/static', express.static(__dirname + '/build/static'))
   .use(bodyParser())
   .use(session(sessionOptions))


/* routes */
app.get('/', site.index);

//app.get('/login', authentication.getLogin);
//app.post('/login', authentication.login);


// session test

app.use(function( req, res, next ) {
   var views = req.session.views;

   console.log(views);

   if( !views ) {
      views = req.session.views = {};
   }

   var pathname = url.parse(req.url).pathname;

   views[pathname] = ( views[pathname] || 0 ) + 1 

   next();

});

app.get('/count', function( req, res, next) {
   res.send('you viewed this page ' + req.session.views['/count'] + ' times');
});


/* if no path already responded, assume 404 */
app.use(function(req, res, next) {
   res.status(404).render('404', { url: req.originalUrl });
});

var server = app.listen(3000, function() {

   var host = server.address().address;
   var port = server.address().port;

   console.log( 'Listening on http://%s:%s', host, port );
});

module.exports = app;
