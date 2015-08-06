//sets environmental variables... should happen before anything else
//require('./controllers/env.js').set();

var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var url = require('url');

var models = require('./models');
var Q = require('q');

/* passport */
var passport = require('passport');
var userAuthentication = require('./controllers/authentication').userAuthentication;
var ensureAuthenticated = require('./controllers/authentication').ensureAuthenticated;
passport.use( userAuthentication );

var app = express();
var sessionOptions = {
   secret: 'a test secret',
   resave: false,
   saveUninitialized: true,
   // if we are running in production, only serve secure cookies
   // $export NODE_ENV=production, defaults to development
   cookie: { secure: ( app.get('env') === 'production' ) }
};

/* general configuration */
app.set('view engine', 'jade')
   .set('views', __dirname + '/views');


/* serves static files with the /static prefix: /static/css.main.css */
app.use('/static', express.static(__dirname + '/build/static'))
   // uses node querystring instead of qs
   .use(bodyParser.urlencoded({ extended: false })) 
   .use(session(sessionOptions))
   .use(passport.initialize())
   .use(passport.session());

//sets req.user to locals for automatic inclusion in jade rendering
app.use(function(req, res, next) {
   res.locals.user = req.user;
   next();
});

// routes
var params = require('./routes/params');
var routers = [
   require('./routes'),
   require('./routes/login'),
   require('./routes/me'),
   require('./routes/users'),
   require('./routes/organization'),
   require('./routes/gym')
];


// apply param function to each sub router
routers.forEach( function( router ) {
   router.param('orgUrl', params.resolveOrgUrl);
   router.param('gymUrl', params.resolveGymUrl);

   app.use( '/', router );
})

// if an error was thrown with next, catch it here
app.use( function( err, req, res, next ) {

   console.log('logging an error: ' + err);

   res.status(500).render('404', { url: req.originalUrl });
});

app.use( function(req, res, next) {

   // if we haven't already rendered something, send the 404
   if( !res.headersSent ) {
      res.status(404).render('404', { url: req.originalUrl });
   }
});

// initialize some tasty database stuff
models.sequelize.sync({ force: true })
.then( function() {

   return [
      models.User.create({ 
         email: 'eric@gymbud.com', 
         name: 'eric',
         isAdmin: true,
         password: 'password'
      }),
      models.User.create({
         email: 'e@gymbud.com', 
         name: 'an employee',
         password: 'password'
      }),
      models.User.create({
         email: 'e2@gymbud.com', 
         name: 'a second employee',
         password: 'password'
      }),
      models.User.create({
         email: 'm@gymbud.com', 
         name: 'a member',
         password: 'password'
      })
   ];

}).spread( function( me, testEmployee, testEmployee2, testMember ) {

   return models.Organization.create({
      name: 'The Front',
      urlName: 'the-front' 
   })
   .then(function(organization) {

      return Q.all([
         organization.setCreator(me),

         organization.addAdministrator(me),

         models.Gym.create({
            name: 'SLC',
            urlName: 'slc'

         }).then( function( gym ) {

            return Q.all([ 
               organization.addGym(gym),
               gym.addEmployee(testEmployee, { jobTitle: 'a cool job title' }),
               gym.addEmployee(testEmployee2, { jobTitle: 'second in command' }),
               gym.addMember(testMember, { type: 'yoga' })
            ]);

         })

            /*return gym.getEmployees()
            .then(function( employees ) {

               console.log('employees');
               console.log(employees);
            });

         })*/
      ])
   });

}).then( function() {

   return models.Gym.findAll()
   .then( function( gyms ) {
      console.log('gyms length: ' + gyms.length);
   });

}).then( function() {

   return app.listen( 3000, function() {
      console.log('listening on port 3000');
   });

})
.catch( function( error ) {

   console.log( error );
});

module.exports = app;
