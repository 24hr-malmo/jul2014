var zmq = require('zmq');
var zocket = zmq.socket('sub');
var config = require('../config-manager');
var sessionSockets, io;

zocket.on("error", function(err) {
    logger.error("Error when connecting to realtime service", err);
});

zocket.on("message", function(message) {

    var message = message.toString();
    var decipherRe = /^(.+?)\s(.+?)\s(.+)$/;
    var matches = decipherRe.exec(message);


    if (matches) {

        var userId = matches[1].replace('user-', '');
        var event = matches[2];
        var data = JSON.parse(matches[3]);

        if (!event) {
            console.log("No event name defined for message", data);
            return;
        }

        io.to(userId).emit(event, data);

        logger.verbose("Publish message:", userId, event);

    } else {
        logger.error('Got zmq data that doesnt match "channel eventname data"');
    }



});

//zocket.connect(config.glue.messageServer.url);

exports.init = function(ioRef, sessionSocketsRef) {

    io = ioRef;
    exports.io = io;
    exports.zocket = zocket;

    sessionSockets = sessionSocketsRef;

    /*sessionSockets.on('connection', function (err, socket, session) {

        if (session && session.passport && session.passport.user) {
            socket.join(session.passport.user);
        }

    });*/

}

