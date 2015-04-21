var bcrypt = require('bcrypt-nodejs');

var users = [];
var nextId = 0;

function addUser( username, password, role, fn ) {

   findByUsername( username, function( err, user ) {

      if( user ) {
         fn( new Error('User already exists'), null );
      } else {

         var hashed = bcrypt.hashSync( password );

         console.log( 'added user: [' + username+ ': ' + hashed + ']' );
         
         var curId = nextId++;

         users.push({ 
            username: username, 
            password: hashed, 
            role: role, 
            id: curId 
         });


         if(fn) { fn( null, users[curId] ); }
      }

   });

};

function findById( id, fn ) {

   if( !users[id] ) { 
      fn( new Error('User ' + id + ' does not exist'), null );
   }

   fn( null, users[idx] );
};

function findByUsername( username, fn ) {

   for (var i = 0, len = users.length; i < len; i++) {
      var user = users[i];
      if (user.username === username) {
         return fn(null, user);
      }
   }

   return fn(null, null);
};

exports.addUser = addUser;
exports.findByUsername = findByUsername;
exports.findById = findById;
