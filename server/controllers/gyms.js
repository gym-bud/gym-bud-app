var Q = require('q');
var user = require('../controllers/user');

/*
 * Gym
 *
 * id
 *
 * gymName
 * gymPhysicalAddress
 * gymPhoneNumber
 * gymEmailAddress
 */
var gyms = [];
var nextGymId = 0;

/*
 * Gym Group
 *
 * id
 * gymGroupName
 *
 */
var gymGroups = [];
var nextGymGroupId = 0; 

/*
 * Gym Group Admins
 *
 * id
 * gymGroupId
 * userId
 */
var gymGroupAdmins = [];
var nextGymGroupAdminId = 0;

/*
 * Gym User Permission
 *
 * id
 * userId
 * gymId
 * roleId
 */
var gymUserPermissions = [];
var nextGymUserPermissionId = 0;

var regexGymAddress = /.*/;
var regexGymName = /.*/;
var regexGymPhoneNumber = /.*/;

/**
 * A gym group is created by a user (who will be the admin)
 */
function createGymGroup( adminUserId, gymGroupName ) {

   return user.getUserById( adminUserId )
      .then( function( user ) {

         var gymGroup = {
            id: nextGymGroupId++,
            name: gymGroupName
         };

         var gymGroupAdmin = {
            id: nextGymGroupAdminId++,
            gymGroupId: gymGroup.id,
            adminId: adminUserId
         }

         gymGroups.push( gymGroup );
         gymGroupAdmins.push( gymGroupAdmin );

         return gymGroup;

      });
};

/**
 *
 */
function deleteAllGymGroups() {

   var d = Q.defer();

   gymGroups = [];
   nextGymGroupId = 0;

   return d.promise;
};

/**
 *
 */
function getGymGroupById( gymGroupId ) {

   var d = Q.defer();

   for (var i = 0, len = gymGroups.length; i < len; i++ ) {

      if ( gymGroups[i].id === gymGroupId ) {
         d.resolve( gymGroups[i] );
         break;
      }
   }

   d.reject( new Error('User with id [' + gymGroupId + '] does not exist') );

   return d.promise;

};

/**
 *
 */
function getGymGroupIdsByAdmin( adminId ) {

/*
   var d = Q.defer();

   var retGymGroups = [];

   for( var i = 0, len = gymGroupAdmins.length; i < len; i++ ) {

      if( gymGroupAdmins[i].userId === adminId ) {
      }
   }

   if( retGymGroups.length === 0 ) {
      d.reject( new Error('User with id [' + gymGroupId + '] does not exist') );
   } else {
      d.resolve( retGymGroups );
   }


   return d.promise;
   */

};

/**
 *
 *
function addGymToGymGroup( gymGroupId, gymName, gymAddress, gymPhoneNumber ) {

   var d = Q.defer();

   if( gymName.search(regexGymName) == -1 ) {
      d.reject( new Error('The gym name [' + gymName +'] is invalid.') );
   }

   if( gymAddress.search(gymAddress) == -1 ) {
      d.reject( new Error('The gymAddress [' + gymAddress +'] is invalid.') );
   }

   if( gymPhoneNumber.search(regexGymPhoneNumber) == -1 ) {
      d.reject( new Error('The gymAddress [' + gymPhoneNumber + '] is invalid.') );
   }

   getGymByName( gymName )
      .then( function( gym ) {

         d.reject( new Error('User with username [' + gym.gymName + '] already exists') );
         
      }, function( err ) {

         var hashed = bcrypt.hashSync( password );

         var user = {
            username: username,
            password: hashed,
            id: nextId++
         };

         gyms.push( gym );

         d.resolve( user );
      });

   return d.promise;

};
*/

module.exports = {
   createGymGroup: createGymGroup,
   deleteAllGymGroups: deleteAllGymGroups 
};

