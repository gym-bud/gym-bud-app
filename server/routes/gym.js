var express = require('express');
var router = express.Router({ mergeParams: true });
var models = require('../models');
var Q = require('q');
var ensureAuthenticated = require('../controllers/authentication').ensureAuthenticated;

router.get( '/:orgUrl/:gymUrl', function( req, res, next ) {

   Q.all([
      req.gym.getEmployees(),
      req.gym.getMembers()
   ])
   .spread(function(employees, members) {

      res.render('gym/home', {
         employees: employees,
         members: members
      });

   })
   .nodeify(next);

});

router.get( '/:orgUrl/:gymUrl/membership/join', function( req, res, next ) {

   Q.all([
      req.gym.getEmployees(),
      req.gym.getMembers()
   ])
   .spread(function(employees, members) {

      res.render('gym/home', {
         employees: employees,
         members: members
      });

   })
   .nodeify(next);

});

router.get( '/:orgUrl/:gymUrl/membership/join', function( req, res, next ) {

   Q.all([
      req.gym.getEmployees(),
      req.gym.getMembers()
   ])
   .spread(function(employees, members) {

      res.render('gym/home', {
         employees: employees,
         members: members
      });

   })
   .nodeify(next);

});

module.exports = router;
