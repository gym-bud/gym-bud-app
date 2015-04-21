var user = require('../controllers/user');

describe('User module', function() {

   it('can add users with a username, password, and role', function() {

      user.addUser( 'eric@example.com', 'secret', 'owner', function( err, userId ) { 
         expect(err).toBe(null);
      });

   });
   
   it('will fail if a username already exists', function() {

      user.addUser( 'anothr@example.com', 'asecret', 'employee', null ); 

      user.addUser( 'anothr@example.com', 'secret', 'owner', function( err, userId ) { 
         expect(err).not.toBe(null);
      });

   });

});
