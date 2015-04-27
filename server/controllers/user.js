var Q = require('q');
var bcrypt = require('bcrypt-nodejs');

var users = [];
var nextId = 0;

/**
 *
 */
function addUser( username, password ) {

   var d = Q.defer();

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

         users.push( user );

         d.resolve( user );
      });

   return d.promise;

/*
   findByUsername( username, function( err, user ) {

      if( user ) {
         fn( new Error('User already exists'), null );
      } else {

         var hashed = bcrypt.hashSync( password );

         console.log( 'added user: [' + username+ ': ' + hashed + ']' );
         
         var curId = nextId++;

         users.push({ 
            username: username, 
            password: hashed, 
            role: role, 
            id: curId 
         });


         if(fn) { fn( null, users[curId] ); }
      }

   });
*/

};

/**
 *
 */
function removeAllUsers() {
   var d = Q.defer();

   var users = [];
   var nextId = 0;

   d.resolve();

   return d.promise;
};

/**
 *
 */
function getUserById( id ) {

   var d = Q.defer();

   if( !users[id] ) { 
      d.reject( new Error('User with id [' + id + '] does not exist') );
   }

   d.resolve( users[id] );

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

