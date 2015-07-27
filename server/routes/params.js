
var Q = require('q');
var models = require('../models');

module.exports = {
   resolveOrgUrl: function(req, res, next, url) {

      console.log('resolving orgUrl');

      models.Organization.findOne({ 
         where: { urlName: url } 
      }).then(function( organization ) {

         // no organization matches this name, not an error 
         // so other routes can attempt to match it
         if( !organization ) {
            throw new Error('not a organization url: ' + url); 
         }
         req.organization = organization;
         res.locals.org = organization;

         
         return Q.all([

            req.organization.isAdmin( req.user )
            .then( function( isAdmin ) {
               req.isOrganizationAdmin = isAdmin;
               res.locals.isOrgAdmin = isAdmin;
            }),
            req.organization.isCreator( req.user )
            .then(function( isCreator ) {
               req.isOrganizationCreator = isCreator;
               res.locals.isOrgCreator = isCreator;
               res.locals.orgCreatorId = req.user.getId();
            })
         ]);

      })
      .nodeify(next);
   },

   resolveGymUrl: function(req, res, next, url) {

      console.log('resolving gymUrl');

      if( !req.organization ) {
         throw new Error('trying to resolve gymUrl, but organizationUrl not resolved');
      }

      models.Gym.findOne({ 
         where: { urlName: url } 
      }).then(function( gym ) {

         // no organization matches this name, not an error 
         // so other routes can attempt to match it
         if( !gym ) {
            throw new Error('not a gym url'); 
         }

         req.gym = gym ;
         res.locals.gym = gym;
      })
      .nodeify(next);

   }
};
