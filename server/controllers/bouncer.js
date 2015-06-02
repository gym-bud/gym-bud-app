function bouncer( min, max, free ) {

   var instance = this;

   if( typeof min !== 'number' ) min = 5000;
   if( typeof max !== 'number' ) max = 600000;
   if( typeof free !== 'number' ) free = 2;

   if( min < 1 ) min = 1;
   if( max < min ) max = min;
   if( free < 2 ) free = 2;

   var delays = [];
   var addressAttempts = {};
   var whiteList = [];


   while( free-- ) { delays.push( 0 ); }
   delays.push( min );
   delays.push( min );

   while( true ) {

      var value = delays[delays.length-1] + delays[delays.length-2];

      if(value > max) {
         delays.push( max );
         break;
      }

      delays.push( value );
   }

   this.block = function( req, res, next ) {

      var address;

      console.log( addressAttempts );

      try {

         address = req.headers['x-forwarded-for'] || 
            req.connection.removeAddress ||
            req.socket.remoteAddress || 
            req.connection.socket.remoteAddress;

      } catch( err ) { 
         
         console.log('[ BOUNCER ] Invalid IP address, not blocking.');
      }

      if( !address || whiteList.indexOf( address ) > -1 ) {

         typeof next === 'function' && next();
         return;

      }

      var addressAttempt = addressAttempts[ address ] || { count: 0, lastAttempt: 0 };

      var remaining = addressAttempt.lastAttempt - Date.now() + delays[addressAttempt.count];

      console.log('remaining: ' + remaining);

      if( remaining > 0 ) {

         next( 'Too many requests, please wait ' + Math.round(remaining / 1000) + ' seconds.' );
         return;
      } 


      addressAttempt.lastAttempt = Date.now();

      if( addressAttempt.count < delays.length - 1 ) { 
         addressAttempt.count++; 
      }

      addressAttempts[ address ] = addressAttempt;

      typeof next === 'function' && next();
      return;
   };

}

/* exports */
module.exports = function( min, max, free ) { 
   return new bouncer( min, max, free );
};

