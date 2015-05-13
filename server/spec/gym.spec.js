var gym = require('../controllers/gyms');
var user = require('../controllers/user');

var testGroupName = 'testGroupName';
var testUsername = 'eric@example.com';
var testPassword = 'password';

xdescribe('gym module', function() {

   beforeEach(function( done ) {

      user.removeAllUsers()
         .then(function() {
            done();
         });

      gym.removeAllGymGroups()
         .then(function() {
            done();
         });

   });

   it('can create a gym group if we create the user first', function( done ) {


      user.addUser( testUsername, testPassword )
         .then( function( user ) {
         
            return gym.createGymGroup( user.id, testGroupName );

         })
         .then( function( gymGroup ) {

            expect( gymGroup.id ).toBe( 0 );
         
         }, function( err ) {
            
            expect( err ).not.toBeDefined();

         })
         .done( done );

   });

   it('cannot create a gym group if we do not supply a valid user id', function( done ) {

      var testUserIdInvalid = 999;

      user.addUser( testUsername, testPassword )
         .then( gym.createGymGroup.bind( null, testUserIdInvalid, testGroupName ) )
         .then( function( gymGroup ) {

            expect( gymGroup ).not.toBe( null );
         
         }, function( err ) {
            
            expect( err ).toBeDefined();

         })
         .done( done );

   });

   it('can fetch the list of gym groups from a user id', function( done ) {

   });

   it('can fetch the list of gym groups from a user id with no administrated groups', function( done ) {

   });

});
