var gulp = require('gulp');
var stylus = require('gulp-stylus');
var gutil = require('gulp-util');
var livereload = require('gulp-livereload');
var prefixer = require('gulp-autoprefixer');
var fs = require('fs');
var path = require('path');
var shell = require('gulp-shell');

// This task makes sure all css files are pre and postprosseced
gulp.task('css', function() {
    gulp.src(['./public/css/*.styl'])
        .pipe(stylus())
        .pipe(prefixer())
        .pipe(gulp.dest('./public/css'));
});

gulp.task('startwatch', function() {

    livereload.listen();

    gulp.watch('public/css/**/*.styl', ['css']).on('change', livereload.changed);

    gulp.start('start');
    gulp.start('css');

});

gulp.task('watch', function() {

    livereload.listen();

    gulp.watch('public/css/**/*.styl', ['css']).on('change', livereload.changed);

    gulp.start('css');

});


gulp.task('start-front', function() {

    var front = require('./lib/server');
    front.start(function() {
        gutil.log("The Goals Frontend server started");
    });

});


gulp.task('start', function() {

    // check if we should turn off security
    var security = gutil.env.security !== "false";
    if (!security) {
        global.securityForApi = false;
    }

    gulp.start('start-front', ['css']);

});



// Task to copy the correct configs to the right place depending on environment
// This task migth need ot be split up later and part of a common deployment scripts package
gulp.task('config', function() {

    // Setup config for front end server
    var environment = gutil.env.env || 'development';

    // Copy the config file, if it exists
    fs.exists('./configs/' + environment + '.js', function(exists) {
        if (exists) {
            fs.createReadStream('./configs/' + environment + '.js')
                .pipe(fs.createWriteStream('./config.js'));
            gutil.log('Front config in enviroment "' + environment + '" copied.'); 
        }
    });


    // Copy the config file for glue, if it exists
    fs.exists('./goals-glue/configs/' + environment + '.js', function(exists) {
        if (exists) {
            fs.createReadStream('./goals-glue/configs/' + environment + '.js')
                .pipe(fs.createWriteStream('./goals-glue/config.js'));
            gutil.log('Glue config in enviroment "' + environment + '" copied.'); 
        }
    });

});

