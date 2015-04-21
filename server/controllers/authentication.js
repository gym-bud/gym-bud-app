var bcrypt = require('bcrypt-nodejs');

var usersById = {};
var nextUserId = 0;

/*
function addUser( user ) {

   console.log('added user: [' + user.login + ': ' + user.password + ']');

   user.id = ++nextUserId;
   return usersById[nextUserId] = user;
};

var usersByLogin = {
   'eric@example.com': addUser({ 
      login: 'eric@example.com', 
      password: bcrypt.hashSync('apassword'), 
      role: 'admin' 
   })
};
*/

/*
everyauth.everymodule
   .findUserById( function( id, callback ) {
      callback( null, usersById[id] );
   });

everyauth.password
   .loginWith('email')
   .getLoginPath('/login')
   .postLoginPath('/login')
   .loginView('login.jade')
   .authenticate( function( login, password ) {
      
      console.log('authenitcating');

      var errors = [];

      if( !login ) { 
         console.log( 'Missing login' ); 
         errors.push('missing login');
      }
      if( !password ) { 
         console.log( 'Missing password' ); 
         errors.push('missing login');
      }

      if ( errors.length > 0 ) { return errors; }

      var user = usersByLogin[ login ];
      
      if( !user ) { 
         console.log('User does not exist'); 
         return ['user does not exist'];
      }

      if( bcrypt.compareSync(password, user.password) ) { 

         return user;
      } else {
         errors.push('password does not match');
      }


      return errors;


   })
   .getRegisterPath('/register')
   .postRegisterPath('/register')
   .registerView('register.jade')
   .validateRegistration( function( newUserAttrs, errors) {

      var login = newUserAttrs.login;

      if( usersByLogin[login] ) errors.push( 'Login already taken' );

      return errors;
   })
   .registerUser( function( newUserAttrs ) {
      var login = newUserAttrs[this.loginKey()];

      return usersByLogin[login] = addUser(newUserAttrs);
   })
   .loginSuccessRedirect('/')
   .registerSuccessRedirect('/');

*/
