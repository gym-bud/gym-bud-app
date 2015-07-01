//var userController = require('./user');
//var organizationController = require('./organization');
var user = require('../models/user.js');
var passport = require('passport');

/**
 *
 */
function login( req, res ) {

   res.render('login');
}

/**
 *
 */
function register( req, res ) {

   res.render('register');
}

/**
 *
 */
function organization( req, res ) {

   res.render('organization');
}

/**
 *
 */
function organizationError( err, req, res ) {

   res.render('organization', {
      organizationName: req.body.organizationName, 
      organizationUrl: req.body.organizationUrl,
      errorMessage: err
   });
}

/**
 *
 */
function redirectIndex( req, res ) {
   res.redirect('/');
}

/**
 *
 */
function loginError( err, req, res, next ) {
   
   res.render( 'login', { 
      email: req.body.email, 
      errorMessage: err 
   });

}

/**
 *
 */
function index( req, res, next ) {

   if( req.user ) {

      return userController
      .isSystemAdmin( req.user )
      .then( function( isAdmin ) {
         res.render('index', { 
            user: req.user, 
            successMessage: req.successMessage,
            isAdmin: isAdmin 
         });
      })
      .nodeify();

   } else {

      res.render('index', { 
         user: req.user, 
         successMessage: req.successMessage,
         isAdmin: false 
      });

   }

}

/**
 *
 */
function registerError( err, req, res, next ) {
   
   res.render( 'register', { 
      error: err, 
      email: req.body.email, 
      firstName: req.body.firstName, 
      lastName: req.body.lastName 
   });

}

function registerUser( req, res, next ) {

   userController
   .createUser( 
      req.body.email, 
      req.body.password, 
      req.body.firstName, 
      req.body.lastName 
   )
   .nodeify( next );
}

function logoutUser( req, res ) {

   req.logout();

   res.redirect('/');
}

/**
 *
 */
function createOrganization( req, res, next ) {

   console.log('create org', req.body.name);

   organizationController
   .createOrganization(
      req.body.name,
      req.body.url
   )
   .nodeify( next );
}

module.exports = {
   redirectIndex: redirectIndex,
   registerUser: registerUser,
   logoutUser: logoutUser,
   login: login,
   register: register,
   registerError: registerError,
   loginError: loginError,
   index: index,
   organization: organization,
   createOrganization: createOrganization,
   organizationError: organizationError
};

