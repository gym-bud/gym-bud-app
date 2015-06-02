var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

var bcrypt = require('bcrypt-nodejs');

var userController = require('../controllers/user');

/**
 * @override passport's internal serialize user
 */
passport.serializeUser( function( user, done ) {

   done(null, user._id);

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
 * local authentication strategy
 * 
 */
function userAuthentication( email, password, done ) {

   console.log('LOGIN ATTEMPT: ' + email + ' [ ' + password + ' ]' );

   return userController
   .getUserByEmail( email )
   .then( function( user ) {

      if( !bcrypt.compareSync(password, user._password) ) {
         throw new Error('Password does not match.');
      }

      return user;

   })
   .catch( function( err ) {

      // throw ambiguous error so intrudor cannot guess email addresses
      throw new Error('Login name and password do not match');

   })
   .nodeify( done );

}

module.exports = {
   userAuthentication: new localStrategy({ 
      usernameField: 'email', 
      passwordField: 'password' 
   }, userAuthentication)
};
