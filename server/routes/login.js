var bouncer = require('../controllers/bouncer')( 10000, 6000000, 5 );
var express = require('express');
var router = express.Router();

var passport = require('passport');

var models = require('../models');


router.get( '/login', function( req, res ) {

   res.render('login');

});

router.post( '/login', 
   bouncer.block, 

   //probably do some input sanitization here
   
   passport.authenticate('local'), 

   // login successful
   function( req, res ) {

      res.redirect('/');
   },

   // login failure
   function( err, req, res, next ) {

      res.render('login', {
         email: req.body.email,
         errors: [err]
      });
   }
);

router.get( '/logout', function( req, res ) {

   req.logout();
   res.redirect('/');

});

router.get( '/register', function( req, res ) {

   res.render('register');

});

router.post( '/register', function( req, res, next ) {

   //probably do some input sanitization here

   return models.User.create({ 
      email: req.body.email, 
      name: req.body.name,
      isAdmin: (req.body.email == 'ebuckthal@gmail.com') ? true : false,
      password: req.body.password
   })
   .nodeify( next );
   
}, passport.authenticate('local')
 , function( req, res ) {

   res.redirect('/');

}, function( err, req, res, next ) {

   res.render( 'register', {
      errors: err.errors
   });

});

module.exports = router;
