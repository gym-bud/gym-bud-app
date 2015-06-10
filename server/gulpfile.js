var gulp = require('gulp');
var jshint = require('gulp-jshint');
var nodemon = require('gulp-nodemon');

gulp.task( 'lint', function() {

   gulp.src(['./controllers/*.js', 'index.js'])
      .pipe(jshint())
      .pipe(jshint.reporter('default'))

});

gulp.task( 'start', ['lint'], function() {

   nodemon({
      script: 'index.js',
      ext: 'js jade html scss',
      ignore: ['**/*.spec.js'],
      tasks: ['lint'],
      env: { 'NODE_ENV': 'development' }
   })

});
