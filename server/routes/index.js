var models = require('../models');
var express = require('express');
var router = express.Router();

router.get('/', function( req, res ) {

   var params = {};

   if( req.user ) {
      params.currentUser = req.user;
   }

   res.render( 'index', params );

});

router.get('/admin', function( req, res ) {

   var params = {};

   if( req.user && req.user.isAdmin ) {

      res.render( 'admin', params );

   } else {

      res.status(404).render('404', { url: req.originalUrl });

   }
});

module.exports = router;
