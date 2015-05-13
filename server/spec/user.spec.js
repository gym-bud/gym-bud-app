require('../env/env').set();
var user = require('../controllers/user');

describe('user module', function() {

   beforeEach(function( done ) {
      user.removeAllUsers()
         .then( done );
   });

   it('can add a user with a username and password', function( done ) {

      user.addUser( 'eric@gymbud.rocks', 'apassword', 'afirstname', 'atrickylastname' )
         .then(function( userid ) { 

            expect( userid ).toBeGreaterThan( 0 );

         }, function( err ) {

            expect( err ).not.toBeDefined();

         })
         .done( done );
   });

   it('can remove all users', function( done ) {

      user.addUser( 'testuser@unuseddomain.org', 'secretly', 'fn', 'ln' )
         .then( user.addUser.bind( null, 'testuser@testdomain.org', 'secretly', 'fn', 'ln' ) )
         .then( user.addUser.bind( null, 'testuser@validdomain.org', 'bigsecret', 'fn', 'ln' ) )
         .then( user.removeAllUsers )
         .then( function( rowsDeleted ) {
            
            //added 3 users, 3 should be deleted
            expect( rowsDeleted ).toBe( 3 );

         })
         .catch( function( err ) {

            expect( err ).not.toBeDefined();

         })
         .done( done );

   });

   it('will fail if that username already exists', function( done ) {

      user.addUser( 'eric@gymbud.rocks', 'secret', 'fn', 'ln' )
         .then( user.addUser.bind( null, 'eric@gymbud.rocks', 'secret', 'fn', 'ln' ) )
         .then( function( userid ) {

            expect( userid ).not.toBeDefined();

         }, function( err ) {
            
            expect( err ).toBeDefined();

         })
         .done( done );

   });

   // TODO: add more invalid emails
   it('will fail if the username is not a valid email', function( done ) {

      user.addUser( 'aninvalidemail@dfa', 'secret' )
         .then( function( userid ) {
         
            expect( userid ).not.toBeGreaterThan( 0 );

         }, function( err ) {

            expect( err ).not.toBe( undefined );

         })
         .done( done );
   });

   it('will fail if the password is not at least 6 characters', function( done ) {

      user.addUser( 'valid@anotherdomain.org' , 'short' )
         .then( null, function( err ) {
            expect(err).not.toBe(null);
         })
         .done( done );
   });

   it('can get a user by its id', function( done ) {

      user.addUser( 'eric@gymbud.rocks', 'apassword', 'afirstname', 'atrickylastname' )
         .then(function( userid ) { 
         
            return user.getUserById( userid );

         })
         .then(function( user ) {

            expect( user.email ).toBe( 'eric@gymbud.rocks' );
            expect( user.password ).not.toBe( undefined );
            expect( user.first_name ).toBe( 'afirstname' );
            expect( user.last_name ).toBe( 'atrickylastname' );

         })
         .catch(function( err ) {

            expect( err ).not.toBeDefined();

         })
         .done( done );

   });

   it('can get a user by its email', function( done ) {

      user.addUser( 'eric111@gymbud.rocks', 'passylongpassy', 'ericfirst', 'ericlast' )
         .then(function( userid ) { 

            return user.getUserByEmail( 'eric111@gymbud.rocks' );

         })
         .then(function( user ) {

            expect( user.email ).toBe( 'eric111@gymbud.rocks' );
            expect( user.password ).not.toBe( undefined );
            expect( user.first_name ).toBe( 'ericfirst' );
            expect( user.last_name ).toBe( 'ericlast' );

         })
         .catch(function( err ) {

            expect( err ).not.toBeDefined();

         })
         .done( done );

   });

});
