var express = require('express');
var app = express();


/* general configuration */
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');


/* controllers */
var site = require('./controllers/site');

/* serves static files with the /static prefix: /static/css.main.css */
app.use('/static', express.static(__dirname + '/build/static'));


/* routes */
app.get('/', site.index);

/* assume 404 */
app.use(function(req, res, next) {

   res.status(404).render('404', { url: req.originalUrl });
});

var server = app.listen(3000, function() {

   var host = server.address().address;
   var port = server.address().port;

   console.log( 'Listening on http://%s:%s', host, port );
});
