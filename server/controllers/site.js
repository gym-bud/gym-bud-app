var userController = require('./user');
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
function loginSuccess( req, res ) {

   res.redirect('/');
}

/**
 *
 */
function loginFailure( err, req, res, next ) {
   
   res.render( 'login', { 
      email: req.body.email, 
      error: err 
   });

}

/**
 *
 */
function index( req, res, next ) {

   res.render('index', { user: req.user });
}

/**
 *
 */
function error( req, res, next ) {


   res.redirect('index');
}

/**
 *
 */
function secret( req, res ) {

   res.render('user', { user: req.user });

}

/**
 *
 */
function registerFailure( err, req, res, next ) {
   
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
   .then( userController.makeAdminIfEmail('ebuckthal@gmail.com') )
   .nodeify( next );
}

function logoutUser( req, res ) {

   req.logout();

   res.redirect('/');
}

module.exports = {
   registerUser: registerUser,
   logoutUser: logoutUser,
   login: login,
   register: register,
   registerFailure: registerFailure,
   loginSuccess: loginSuccess,
   loginFailure: loginFailure,
   index: index,
   error: error 
};

