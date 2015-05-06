var user = require('../controllers/user');

var testUsername = 'eric@example.com';
var testUsername2 = 'eric@billion.com';
var testUsername3 = 'eric@trillion.com';
var testUsernameInvalid = 'aninvalidemaiL@f';

var testPassword = 'secret';
var testPasswordShort = 'secre';

describe('user module', function() {

   beforeEach(function( done ) {
      user.removeAllUsers()
         .then(function() {
            done();
         });

   });

   it('can add a user with a username and password', function( done ) {

      user.addUser( testUsername, testPassword )
         .then(function( user ) { 
            
            expect( user.username ).toBe( testUsername );

         }, function( err ) {

            expect( err ).not.toBeDefined();

         })
         .done( done );
   });

   it('can remove all users', function( done ) {

      user.addUser( testUsername, testPassword )
         .then( user.addUser.bind( null, testUsername2, testPassword ) )
         .then( user.addUser.bind( null, testUsername3, testPassword ) )
         .then( user.removeAllUsers )
         .then( function( usersLength ) {
            
            expect( usersLength ).toBe( 0 );

         })
         .catch( function( err ) {

            expect( err ).not.toBeDefined();

         })
         .done( done );

   });

   it('will fail if that username already exists', function( done ) {

      user.addUser( testUsername, testPassword )
         .then( function( newUser ) {

            return user.addUser( testUsername, testPassword );

         })
         .catch( function( err ) {
            
            expect( err ).toBeDefined();

         })
         .done( done );

   });

   // TODO: add more invalid emails
   it('will fail if the username is not a valid email', function( done ) {


      user.addUser( testUsernameInvalid, testPassword )
         .then( null, function( err ) {
            expect(err).not.toBe(null);
         })
         .done( done );
   });

   it('will fail if the password is not at least 6 characters', function( done ) {

      user.addUser( testUsername, testPasswordShort )
         .then( null, function( err ) {
            expect(err).not.toBe(null);
         })
         .done( done );
   });

   //TODO
   xit('can get a user by its id', function( done ) {

   });


});
