var treeize = require('treeize');
var knex = require('knex')({
   client:'mysql',
   connection: process.env.GB_MYSQL_CONNECTION_STRING
});

//maybe add some db helper funcs here

module.exports = {
   knex: knex,
   treeize: treeize
}
