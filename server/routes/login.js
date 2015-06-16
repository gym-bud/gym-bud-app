var bouncer = require('../controllers/bouncer')( 10000, 6000000, 5 );
var express = require('express');
var router = express.Router();

var passport = require('passport');

router.get( '/login', function( req, res ) {

   res.render('login');

});

router.post( '/login', 
   bouncer.block, 
   passport.authenticate('local'), 

   // login successful
   function( req, res ) {

      res.redirect('/');
   },

   // login failure
   function( err, req, res ) {

      res.render('login', {
         email: req.body.email,
         errorMessage: err
      });
   }
);


router.get( '/logout', function( req, res ) {

   req.logout();

   res.redirect('/');

});

router.get( '/register', function( req, res ) {

});

module.exports = router;
