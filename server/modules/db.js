var treeize = require('treeize');
var q = require('q');

var knex = require('knex')({
   client:'mysql',
   connection: {
      host: process.env.GB_MYSQL_HOST,
      database: process.env.GB_MYSQL_DATABASE,
      user: process.env.GB_MYSQL_USERNAME,
      password: process.env.GB_MYSQL_PASSWORD,
   }
});

//maybe add some db helper funcs here

function getUser(opts, callback) {
   var deferred = q.defer();
   knex.select().from('user').then(function(rows) {
      deferred.resolve(rows);
   });

   return deferred.promise.nodeify(callback);
}

module.exports = {
   knex: knex,
   treeize: treeize,
   getUser: getUser
}
