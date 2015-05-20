var Q = require('q');
var bcrypt = require('bcrypt-nodejs');
var _ = require('lodash');
var knex = require('./db').knex;

var minPasswordLength = 6;
var emailRegex = /[A-Za-z0-9._%+-]+\@[A-Za-z]*\.[A-Za-z]*\.*[A-Za-z]*/;

/**
 * @constructor
 */
function User( id, email, password, firstname, lastname ) {

   this._id = id;
   this._email = email;
   this._password = password;
   this._firstname = firstname;
   this._lastname = lastname;
}

/**
 *
 * isSystemAdmin :: User -> Boolean Promise
 */
User.prototype.isSystemAdmin = function() {

   console.log('isSystemAdmin? ' + this._id);

   return knex
   .from('user')
   .innerJoin('system_admin', 'user.id', 'system_admin.user_id')
   .where({ 'user.id' : this._id })
   .then( function( results ) {
      
      if( results.length > 0 ) {

         return true;

      } else {

         throw new Error('No admin rights');
      }
   });

}

/**
 *
 * validateEmail :: String -> Promise String
 */
function validateEmail( email ) {

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
 * validatePassword :: String -> Promise String
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
 * validateFirstName :: String -> Promise String
 */
function validateFirstName( firstname ) {
   
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
 * validateLastName :: String -> Promise String
 */
function validateLastName( lastname ) {

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

      console.log('make admin if email: ' + email + ' and ' + user._email);

      if( user._email === email ) {

         return knex
         .insert({ 'user_id': user._id })
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
function removeAllUsers() {

   return knex( 'user' ).del();
}

/**
 *
 * extractUser :: DB User rows -> User
 */
function extractUser( dbResult ) {

   if( dbResult.length === 0 ) {
      throw new Error('User with id: ' + userid + ' does not exist');
   }

   return new User(
      dbResult[0].id, 
      dbResult[0].email, 
      dbResult[0].password, 
      dbResult[0].first_name, 
      dbResult[0].last_name
   );
}

/**
*
* getUserById :: Number -> User Promise
*/
function getUserById( userid ) {

   return knex
   .select('*')
   .from('user')
   .where({ 'id': userid })
   .then( extractUser )
   .catch( function( err ) {

      throw new Error('User with id: ' + userid + ' does not exist');
   });

}

/**
*
* getUserByEmail :: String -> User Promise
*/
function getUserByEmail( email ) {

   return knex
   .select('*')
   .from('user')
   .where({ 'email': email })
   .then( extractUser )
   .catch( function( err ) {

      throw new Error('User with email: ' + email + ' does not exist');
   });
}

module.exports = {
   removeAllUsers: removeAllUsers,
   getUserByEmail: getUserByEmail,
   getUserById: getUserById,
   createUser: createUser,
   makeAdminIfEmail: makeAdminIfEmail
};

