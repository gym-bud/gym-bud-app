var user = require('../controllers/user');

describe('user module', function() {

   beforeEach(function( done ) {
      user.removeAllUsers()
         .then(function() {
            done();
         });

   });

   it('can add a user with a username and password', function( done ) {

      var testUsername = 'eric@example.com';
      var testPassword = 'secret';

      user.addUser( testUsername, testPassword )
         .then(function( user ) { 
            
            expect( user.username ).toBe( testUsername );

         }, function( err ) {

            expect( err ).toBe(null);

         })
         .done( done );
   });

   it('will fail if that username already exists', function( done ) {

      var testUsername = 'eric@example.com';
      var testPassword = 'secret';

      user.addUser( testUsername, testPassword )
         .then( user.addUser.bind(null, testUsername, testPassword) )
         .then( null, function( err ) {
            
            expect( err ).not.toBe( null );
         })
         .done( done );

   });

   it('will fail if the username is not a valid email', function() {

      user.addUser( 'notavalidemail', 'secret', function( err, userId ) { 
         expect(err).not.toBe(null);
      });
   });

   it('will fail if the password is not at least 6 characters', function() {

      user.addUser( 'eric@example.com', 'secre', function( err, userId ) {
         expect(err).not.toBe(null);
      });
   });
   

});
