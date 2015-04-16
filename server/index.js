//sets environmental variables... should happen before anything else
require('./modules/env.js').set();

var db = require("./modules/db.js");

var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var url = require('url');

var everyauth = require('everyauth');
var bcrypt = require('bcrypt-nodejs');

var usersById = {};
var nextUserId = 0;


function addUser( user ) {

   console.log('added user: [' + user.login + ': ' + user.password + ']');

   user.id = ++nextUserId;
   return usersById[nextUserId] = user;
};

var usersByLogin = {
   'eric@example.com': addUser({ login: 'eric@example.com', password: bcrypt.hashSync('apassword'), role: 'admin' })
};

everyauth.everymodule
   .findUserById( function( id, callback ) {
      callback( null, usersById[id] );
   });

everyauth.password
   .loginWith('email')
   .getLoginPath('/login')
   .postLoginPath('/login')
   .loginView('login.jade')
   .authenticate( function( login, password ) {
      
      console.log('authenitcating');

      var errors = [];

      if( !login ) { 
         console.log( 'Missing login' ); 
         errors.push('missing login');
      }
      if( !password ) { 
         console.log( 'Missing password' ); 
         errors.push('missing login');
      }

      if ( errors.length > 0 ) { return errors; }

      var user = usersByLogin[ login ];
      
      if( !user ) { 
         console.log('User does not exist'); 
         return ['user does not exist'];
      }

      if( bcrypt.compareSync(password, user.password) ) { 

         return user;
      } else {
         errors.push('password does not match');
      }


      return errors;


   })
   .getRegisterPath('/register')
   .postRegisterPath('/register')
   .registerView('register.jade')
   .validateRegistration( function( newUserAttrs, errors) {

      var login = newUserAttrs.login;

      if( usersByLogin[login] ) errors.push( 'Login already taken' );

      return errors;
   })
   .registerUser( function( newUserAttrs ) {
      var login = newUserAttrs[this.loginKey()];

      return usersByLogin[login] = addUser(newUserAttrs);
   })
   .loginSuccessRedirect('/')
   .registerSuccessRedirect('/');


/* controllers */
var site = require('./controllers/site');


var app = express();

/* general configuration */
app.set('view engine', 'jade')
   .set('views', __dirname + '/views');

/* serves static files with the /static prefix: /static/css.main.css */
app.use('/static', express.static(__dirname + '/build/static'))
   .use(session({ 
      secret: 'a test secret',
      resave: false, 
      saveUninitialized: true
   }))
   .use(bodyParser())
   .use(everyauth.middleware());


/* routes */
app.get('/', site.index);

app.use(function( req, res, next) {
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
