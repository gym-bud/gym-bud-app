
var express = require('express');
var router = express.Router();
var models = require('../models');
var ensureAuthenticated = require('../controllers/authentication').ensureAuthenticated;

router.get( '/users', 
   function( req, res ) {

      models.User.findAll({

      }).then(function( data ) {
         
         res.render('user/list', {
            users: data
         });

      });
   }
)

module.exports = router;
