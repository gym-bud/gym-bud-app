var Q = require('q');
var knex = require('./db').knex;

var urlRegex= /[A-Za-z]+([A-Za-z]*-[A-Za-z]+)*/;

/**
 *
 * @constructor
 */
function Organization( id, name, url ) {

   this._id = id;
   this._name = name;
   this._url = url;
}

/**
 *
 * validateRealName :: String (real name) -> Promise String (real name) 
 */
function validateRealName( realName ) {
   
   var d = Q.defer();

   d.resolve( realName );

   return d.promise;
}

/**
 * e.g. gymbud.rocks/thefront/
 *                   ^^^^^^^^
 *
 * validateUrlName:: String (URL name) -> Promise String (URL name) 
 */
function validateUrlName( urlName ) {

   var d = Q.defer();

   if( urlName.indexOf(' ') < 0 && urlRegex.test(urlName) ) {
      d.resolve( urlName );
   }

   d.reject( new Error('Invalid URL Name') );

   return d.promise;
}

/**
 *
 */
function createOrganization( realName, urlName ) {

   console.log(realName, urlName);

   return Q.all([
      validateRealName( realName ),
      validateUrlName( urlName )
   ])
   .then( function( results ) {

      var org = {
         'name': results[0],
         'url_name': results[1],
      }

      return knex
      .insert(org)
      .into('organization')
      .returning('id')
      .then( function( result ) {
         return getOrganizationById( result[0] );
      });

   });

}

/**
 *
 * extractOrganization :: DB User rows -> Organization 
 */
function extractOrganization( dbResult ) {

   if( dbResult.length === 0 ) {
      throw new Error('Organization extraction failed');
   }

   return new Organization(
      dbResult[0].id, 
      dbResult[0].name,
      dbResult[0].url_name
   );
}

/**
 *
 */
function getOrganizationById( orgid ) {

   return knex
   .select('*')
   .from('organization')
   .where({ 'id': orgid })
   .then( extractOrganization )
   .catch( function( err ) {
      throw new Error('Organization with id: ' + orgid + ' does not exist');
   });
}

module.exports = {
   createOrganization: createOrganization,
   getOrganizationById: getOrganizationById
}
