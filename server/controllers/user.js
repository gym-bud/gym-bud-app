var Q = require('q');
var bcrypt = require('bcrypt-nodejs');
var _ = require('lodash');
var knex = require('./db').knex;

var minPasswordLength = 6;
var emailRegex = /[A-Za-z0-9._%+-]+\@[A-Za-z]*\.[A-Za-z]*\.*[A-Za-z]*/;

/**
 *
 * isValidEmail :: String -> Promise String
 */
function validateEmail( email ) {

   console.log( 'validateEmail: ' + email );

   var d = Q.defer();

   if( email.search(emailRegex) >= 0 ) {

      d.resolve( email );

   } else {

      d.reject( new Error('Invalid email: ' + email) );

   }

   return d.promise;
}

/**
 *
 */
function validatePassword( password ) {

   console.log( 'validatePassword: ' + password );
   
   var d = Q.defer();

   if( password.length > minPasswordLength ) {
   
      d.resolve( bcrypt.hashSync(password) );

   } else {

      d.reject( new Error('Invalid password: ' + password) );

   }

   return d.promise;
}

/**
 *
 */
function validateFirstName( firstname ) {
   
   console.log( 'validateFirstname: ' + firstname );

   var d = Q.defer();

   if( firstname.length > 0 ) {

      d.resolve( firstname );


   } else {

      d.reject( new Error('Invalid firstname: ' + firstname) );

   }

   return d.promise;
}

/**
 *
 */
function validateLastName( lastname ) {

   console.log( 'validateLastname: ' + lastname );
   
   var d = Q.defer();

   if( lastname.length > 0 ) {

      d.resolve( lastname );

   } else {

      d.reject( new Error('Invalid lastname: ' + lastname ) );

   }

   return d.promise;
}

/**
*
*/
function createUser( email, password, firstName, lastName ) {

   return Q.all([
      validateEmail( email ),
      validatePassword( password ),
      validateFirstName( firstName ),
      validateLastName( lastName )
   ])
   .then( function( results ) {

      console.log( results );

      var user = { 
         'email': results[0], 
         'password': results[1], 
         'first_name': results[2], 
         'last_name':results[3] 
      };

      return knex
      .insert(user)
      .into('user')
      .returning('id')
      .then( function( result ) {
         return getUserById( result[0] );
      });
   
   });
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
function makeAdminIfEmail( email ) {

   return function( user ) {

      console.log('make admin if email: ' + email + ' and ' + user.email);

      if( user.email === email ) {

         return knex
         .insert({ 'user_id': user.id })
         .into('system_admin')
         .then( function( ids ) {

            return user;
         });
      }

      return user;
   }
}

/**
 *
 */
function addUserSystemAdmin( userid ) {

   return getUserById( userid )
   .then( function( user ) {

   })
   .then( function( id ) {
      console.log( 'user: ' + id + ' inserted into system admin table');
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

   return knex
   .select('*')
   .from('user')
   .where({ 'id': userid })
   .then( function( rows ) {

      if( rows.length === 0 ) {
         throw new Error('User with id: ' + userid + ' does not exist');
      }

      return rows[0];
   });

}

/**
*
*/
function getUserByEmail( email ) {

   return knex
   .select('*')
   .from('user')
   .where({ 'email': email })
   .then( function( rows ) {

      if( rows.length === 0 ) {
         throw new Error('User with email: ' + email + ' does not exist');
      }

      return rows[0];
   });
}

/**
 *
 */
function isAdmin( userid ) {

   var d = Q.defer();

   knex
   .select('*')
   .from('user')
   .where({ 'email': email })
   .then( function( rows ) {

      if( rows.length === 0 ) {
         d.reject('User does not exist');

      }

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
   createUser: createUser,
   makeAdminIfEmail: makeAdminIfEmail
};

