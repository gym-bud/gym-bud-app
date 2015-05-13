var knex = require('knex')({
   client:'mysql',
   connection: {
      host: process.env.GB_MYSQL_HOST,
      database: process.env.GB_MYSQL_DATABASE,
      user: process.env.GB_MYSQL_USERNAME,
      password: process.env.GB_MYSQL_PASSWORD,
   }
});

module.exports = {
   knex: knex
};
