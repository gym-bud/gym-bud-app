var express = require('express');
var router = express.Router({ mergeParams: true});
var models = require('../models');
var Q = require('q');
var ensureAuthenticated = require('../controllers/authentication').ensureAuthenticated;

// assume ensureAuthenticated called already
function ensureOrganizationCreator( req, res, next ) {

   req.organization.isCreator(req.user)
   .then(function( isCreator ) {

      if( isCreator ) {
         next();
      } else {
         next('You are not the organization creator');
      }
   });
}

router.get( '/organizations', function( req, res ) {

   models.Organization.findAll()
   .then(function( orgs ) {

      res.render('org/list', {
         orgs: orgs 
      });

   });
})

router.post( '/organization/new', ensureAuthenticated, function( req, res, next ) {

   models.Organization.create({
      name: req.body.name,
      urlName: req.body.urlName
   })
   .then(function(organization) {

      // req.user _should_ be set because ensureAuthenticated checks
      organization.setCreator(req.user);
      organization.addAdministrator(req.user);

      res.redirect('/' + organization.urlName);

   })
   .catch( function(error) {

      res.render('org/new', {
         name: req.body.name,
         urlName: req.body.urlName,
         errors: err.errors
      });

   });


});


router.get( '/organization/new', ensureAuthenticated, function( req, res ) {
   res.render('org/new');
});

router.post( '/:orgUrl/new', function( req, res, next ) {

   models.Gym.create({
      name: req.body.name,
      urlName: req.body.urlName
   })
   .then(function( gym ) {

      req.organization.addGym(gym);

      //console.log(gym.getUrl(req.organization));

      res.redirect( gym.getUrl(req.organization) );
   })
   .nodeify( next );

}, function( err, req, res, next ) {

   res.render( 'org/new-gym', {
      name: req.body.name,
      urlName: req.body.urlName,
      errors: err.errors
   });

});

// TODO: change this to be router.put??
router.post( '/:orgUrl/admins', ensureAuthenticated, ensureOrganizationCreator, function( req, res, next ) {

   return models.User.findOne({
      where: { email: req.body.email }
   }).then( function( user ) {
      return req.organization.addAdministrator(user);
   }).then( function() {
      return res.redirect(req.organization.getUrl());
   }).catch( function() {
      return res.redirect(req.organization.getUrl());
   })
   .nodeify( next );
});

// TODO: change this to be router.delete??
router.get( '/:orgUrl/admins/:userId/delete', ensureAuthenticated, ensureOrganizationCreator, function( req, res, next ) {

   return req.organization.removeAdministrator(req.params.userId)
   .then( function() {
      res.redirect(req.organization.getUrl());
   });

});

router.get( '/:orgUrl', function( req, res, next ) {

   return Q.all([
      req.organization.getAdministrators(),
      req.organization.getGyms()
   ])
   .spread(function( administrators, gyms ) {

      res.render('org/home', {
         administrators: administrators,
         gyms: gyms
      });

   })
   .nodeify( next );

});

router.get( '/:orgUrl/new', function( req, res, next ) {

   res.render('org/new-gym');
});


module.exports = router;
