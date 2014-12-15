var gulp = require('gulp');
var stylus = require('gulp-stylus');
var gutil = require('gulp-util');
var livereload = require('gulp-livereload');
var prefixer = require('gulp-autoprefixer');
var fs = require('fs');
var path = require('path');
var async = require('async');
var request = require('request');
var shell = require('gulp-shell');

// This task makes sure all css files are pre and postprosseced
gulp.task('css', function() {
    gulp.src(['./public/assets/css/*.styl'])
        .pipe(stylus())
        .pipe(prefixer())
        .pipe(gulp.dest('./public/assets/css'));
});

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('public/assets/css/**/*.styl', ['css']).on('change', livereload.changed);
    gulp.start('start');
});

gulp.task('start-front', function() {
    var front = require('./lib/');
    front.start(function() {
        gutil.log("The Goals Frontend server started");
    });
});

gulp.task('build', function() {
    gulp.start('css');
});

gulp.task('start', function() {
    gulp.start('start-front', ['build']);
});

gulp.task('sms', function() {

    var server = require('./lib/');
    var db = require('./lib/db');
    var ornamentsControl = require('./lib/controls/ornaments');

    server.start(function() {

        db.del('ornaments', function(err) {

    var amount = gutil.env.amount || 10;

    var amountList = [];

    for(var i = 0; i < amount; i++){
        amountList.push(1);
    }

    var ornaments = ['kula1', 'ljus', 'kula2', 'polka'];
    async.eachSeries(amountList, function(item, next) {

        //gutil.log('try to send one');
        var ornament = ornaments[Math.round(Math.random() * 3)];

        ornamentsControl.add({ name: 'foo bar', type: ornament }).then(function() {

            setTimeout(function() {
                next(err);
            }, 1);

        });

    }, function(err) {
        if (err) gutil.log(err);
            gutil.log('done!');
        //process.exit();
    });

    });
    });
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

