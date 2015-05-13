var Q = require('q');
var bcrypt = require('bcrypt-nodejs');
var _ = require('lodash');
var knex = require('./db').knex;

var users = [];
var nextId = 0;

var minPasswordLength = 6;

/**
 *
 * returns true if email is valid
 */
function isValidEmail( email ) {

   var emailRegex = /[A-Za-z0-9._%+-]+\@[A-Za-z]*\.[A-Za-z]*\.*[A-Za-z]*/;

   console.log( email.search(emailRegex) );

   return ( email.search(emailRegex) >= 0 );
}

/**
*
*/
function createUser( email, password, firstName, lastName ) {

   var d = Q.defer();

   if( !isValidEmail(email) ) {
      d.reject( new Error('The email address [' + email + '] is invalid.') );
   }

   if( password.length < minPasswordLength ) {
      d.reject( new Error('Passwords must be longer than 6 characters.') );
   }

   knex
   .insert({ 
      'email': email, 
      'password': bcrypt.hashSync( password ), 
      'first_name': firstName, 
      'last_name': lastName 
   })
   .into(' user ')
   .then( function( rows ) {

      d.resolve( rows[0] );

   })
   .catch( function( error ) {

      d.reject( error );

   });

   return d.promise;

}

/**
 *
 */
function removeUserSystemAdmin( userid ) {

   return knex('system_admin')
   .where('user_id', userid)
   .delete()
   .then( function() {
      console.log('user: ' + userid + ' deleted from system admin');
   })
   .catch( function() {
      console.log('user: ' + userid + 'failed to delete  from system admin');
   });
}

/**
 *
 */
function addUserSystemAdmin( userid ) {

   return getUserById( userid )
   .then( function( user ) {

      return knex
      .insert({
         'user_id': user.id
      })
      .into('system_admin');

   })
   .then( function( id ) {

      console.log( 'user: ' + id + ' inserted into system admin table');

   })
   .catch( function ( error ) {

      console.log( 'user: ' + id + ' failed to insert into sytem admin table');
   });
}

/**
*
*/
function removeAllUsers() {

   return knex( 'user' ).del();
}

/**
*
*/
function getUserById( userid ) {

   var d = Q.defer();

   knex
   .select('*')
   .from('user')
   .where({ 'id': userid })
   .then( function( rows ) {
      d.resolve( rows[0] );
   });

   return d.promise;

}

/**
*
*/
function getUserByEmail( email ) {

   var d = Q.defer();

   knex( 'user' ).where({ 'email': email })
   .then( function( rows ) {
      d.resolve( rows[0] );
   }, function( err ) {
      d.reject( err );
   });

   return d.promise;
}

module.exports = {
   removeAllUsers: removeAllUsers,
   getUserByEmail: getUserByEmail,
   getUserById: getUserById,
   createUser: createUser 
};

