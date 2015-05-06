var Q = require('q');
var bcrypt = require('bcrypt-nodejs');
var _ = require('lodash');

var users = [];
var nextId = 0;

var emailRegex = /[A-Za-z0-9._%+-]+\@[A-Za-z]*\.[A-Za-z]*\.*[A-Za-z]*/;
var minPasswordLength = 6;

/**
 *
 */
function addUser( username, password ) {

   var d = Q.defer();

   // according to 
   // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address
   // it is best to just try to catch simple email entry errors and not actually all valid email
   // addresses
   if( username.search(emailRegex) == -1 ) {
      d.reject( new Error('The email address [' + username + '] is invalid') );
   }

   if( password.length < minPasswordLength ) {
      d.reject( new Error('Passwords must be longer than 6 characters') );
   }

   getUserByUsername( username )
      .then( function( user ) {

         d.reject( new Error('User with username [' + user.username + '] already exists') );
         
      }, function( err ) {

         var hashed = bcrypt.hashSync( password );

         var user = {
            username: username,
            password: hashed,
            id: nextId++
         };

         console.log(user);
         console.log(user.password.length);

         users.push( user );

         d.resolve( user );
      });

   return d.promise;

};

/**
 *
 */
function removeAllUsers() {
   var d = Q.defer();

   users = [];
   nextId = 0;

   d.resolve( users.length );

   return d.promise;
};

/**
 *
 */
function getUserById( id ) {

   var d = Q.defer();

   for (var i = 0, len = users.length; i < len; i++ ) {

      if ( users[i].id === id ) {
         d.resolve( users[i] );
         break;
      }
   }

   d.reject( new Error('User with id [' + id + '] does not exist') );

   return d.promise;
};

/**
 *
 */
function getUserByUsername( username ) {

   var d = Q.defer();

   for (var i = 0, len = users.length; i < len; i++ ) {

      if ( users[i].username === username ) {
         d.resolve( users[i] );
         break;
      }
   }

   d.reject( new Error('User with username [' + username + '] does not exist') );

   return d.promise;
};

module.exports = {
   removeAllUsers: removeAllUsers,
   getUserByUsername: getUserByUsername,
   getUserById: getUserById,
   addUser: addUser
};

