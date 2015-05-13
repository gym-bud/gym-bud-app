var _ = require('lodash');

function set( defaultPath ) {
   
   var defaults = require( defaultPath || '../defaults.json' );

   // $export NODE_ENV=production, defaults to development
   var env = process.env.NODE_ENV || defaults.defaultEnvironment;
   _.assign( process.env, defaults[env] );
}

module.exports = {
   set: set
};
