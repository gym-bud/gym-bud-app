var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');

var models = require('../models');

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


   models.User.findOne({ where: { 'id': id } })
   .then( function( user ) {

      return user;

   })
   .nodeify( done );

/*
   userController.getUserById( id )
   .then( function( user ) { return user; } )
   .nodeify( done );
*/

});


/**
 * local authentication strategy
 * 
 */
function userAuthentication( email, password, done ) {

   console.log('LOGIN ATTEMPT: ' + email + ' [ ' + password + ' ]' );

   models.User.findOne({ where: { 'email': email }})
   .then( function( user ) {

      if( !user ) {
         throw new Error('User with that email does not exist');
      }

      if( !bcrypt.compareSync(password, user.passwordHash) ) {
         throw new Error('Password does not match.');
      }

      return user;

   })
   /*

   return userController
   .getUserByEmail( email )
   .then( function( user ) {


   })
   .catch( function( err ) {

      // throw ambiguous error so intrudor cannot guess email addresses
      throw new Error('Login name and password do not match');

   })
   */
   .nodeify( done );

}

module.exports = {
   userAuthentication: new localStrategy({ 
      usernameField: 'email', 
      passwordField: 'password' 
   }, userAuthentication)
};
