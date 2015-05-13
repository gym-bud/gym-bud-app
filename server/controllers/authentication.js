var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

var bcrypt = require('bcrypt-nodejs');

var userController = require('../controllers/user');

/**
 * @override passport's internal serialize user
 */
passport.serializeUser( function( user, done ) {

   done(null, user.id);

});

/**
 * @override passport's internal deserialize user
 */
passport.deserializeUser( function( id, done ) {

   userController.getUserById( id )
   .then( function( user ) { return user; } )
   .nodeify( done );

});

/**
 * custom middleware will redirect if not a user 
 *
 */
function ensureUser( req, res, next ) {

   if( req.isAuthenticated() ) {
      return next();
   } else {

      res.render( 'login', { 
         error: 'You must be logged in.' 
      });

   }
}

/**
 * custom middleware will redirect if not an admin 
 *
 */
function ensureAdmin( req, res, next ) {

   if( req.isAuthenticated() ) {
      return next();
   } else {

      res.render( 'login', { 
         email: req.user.email, 
         error: 'You must be logged in as an admin.' 
      });
   }

}

/**
 * local authentication strategy
 * 
 */
function userAuthentication( email, password, done ) {

   console.log('LOGIN ATTEMPT: ' + email + ' [ ' + password + ' ]' );

   return userController.getUserByEmail( email )
   .then( function( user ) {

      if( !bcrypt.compareSync(password, user.password) ) {
         throw new Error('Password does not match.');
      }

      return user;

   })
   .nodeify( done );

}

module.exports = {
   userAuthentication: new localStrategy({ 
      usernameField: 'email', 
      passwordField: 'password' 
   }, userAuthentication),
   ensureUser: ensureUser,
   ensureAdmin: ensureAdmin
};
