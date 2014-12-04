define(['socketio'], function(io) {

    var socket = io.connect(location.protocol + '//' + location.hostname);

    return socket;

});
