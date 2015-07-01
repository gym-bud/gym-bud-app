
var express = require('express');
var router = express.Router();
var models = require('../models');

router.post( '/organizations/create', function( req, res ) {

   models.Organization.create({
      name: req.body.name,
      urlName: req.body.urlName
   })
   .nodeify( next )

});

router.get( '/organizations/new', function( req, res ) {

   res.render('organization.new.jade');

});

module.exports = router;
