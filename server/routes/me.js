
var express = require('express');
var router = express.Router();
var models = require('../models');
var ensureAuthenticated = require('../controllers/authentication').ensureAuthenticated;

router.get( '/me', ensureAuthenticated, function( req, res ) {

   res.render('user/me', {
      user: req.user
   });
});

router.post( '/me', ensureAuthenticated, function( req, res ) {

   req.user.updateAttributes({
      name: req.body.name,
      email: req.body.email
   })
   .then(function() {
      res.redirect('/me');
   })
   .catch(function(error) {

      console.log('an error: ' + error);

      res.render('user/me', {
         errors: [error]
      });
   });

});

router.post( '/me/password', ensureAuthenticated, function( req, res, next ) {

   if(!req.user.comparePassword(req.body.oldPass)) {
      throw new Error('Incorrect password.');
   }

   if( req.body.newPass !== req.body.newPassConfirm ) {
      throw new Error('new passwords do not match');
   }

   req.user.updateAttributes({
      password: req.body.newPass
   })
   .then(function() {

      res.redirect('/me');
   })
   .nodeify(next);

}, function( err, req, res, next ) {

   console.log(err);

   res.render('user/me', {
      errors: [err]
   });
});

// maybe change this to .delete?
router.post( '/me/delete', ensureAuthenticated, function( req, res ) {

   req.user.destroy()
   .then(function() {
      res.redirect('/logout');
   })
   .catch(function(error) {

      res.render('user/me', {
         errors: [error]
      });
   });

});

module.exports = router;
