var express = require('express');
var config = exports.config = require('../config-manager');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var realtime = require('./realtime');

realtime.init(io);

var models = require('./models');
var controls = require('./controls');
var doT = require('express-dot');

var path = require('path');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// define rendering engine
app.set('views', path.join(__dirname, "../views"));
app.set('view options', { layout: false });
app.set('view engine', 'html' );
app.engine('html', doT.__express );

// add globals
var dotFunctions = require('./dot-functions');
doT.setGlobals(dotFunctions);
 
app.use(express.static(path.join(__dirname, '../public')));


// Start both http and zmq socket server
exports.start = function(done) {

    if (typeof done != "function") {
        done = function() {};
    }

    // Load all api endpoints
    var routes = require('./routes');
    for(var i = 0, ii = routes.length; i < ii; i++){ 
        app.use('/', routes[i]);
    };

    console.log("Start 24HR JUL 2014 Server on port %s", config.server.port);
    server.listen(config.server.port, function(err) {
        if (err) return done(err);
        done();
        //realtime.start().then(done).catch(done);
    });

}

// Close the servers, both the http and the zmq socket server
exports.stop = function(done) {

    if (typeof done != "function") {
        done = function() {};
    }

    server.close(function(err) {
        if (err) return done(err);
        realtime.close();
        done();
    });

};
