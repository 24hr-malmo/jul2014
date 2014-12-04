var fs = require('fs');
var async = require('async');
var path = require('path');
var realtime = require('../realtime');
var placePicker = require('./place-picker');
var models = require('../models');

function add(data) {

    models.Ornament

        .loadAll()
        .then(function(list) {

            return placePicker
                .pickPlace(list, 10)
                .then(function(place) {

                    if (place.free > 0) {

                        var displaceX = 10 * Math.random() - 5;
                        var displaceY = 10 * Math.random() - 5;

                        var ornament = new models.Ornament(data.name, data.type, place.slot.x + displaceX, place.slot.y + displaceY);

                        realtime.io.to('general').emit('ornament.added', ornament.getJSON());

                        return ornament.save()

                            // This is just to check how it looks
                            .then(function() {
                                return models.Ornament
                                    .loadAll()
                                    .then(function(list) {
                                        return placePicker
                                        .pickPlace(list, 10, true);

                                    });
                            });
                            //
                    }

                });

        })
        .catch(function(err) {
            console.log("error when adding:", err);   
        });

}

realtime.io.on('connect', function(socket) {

    socket.join('general');

    socket.on('ornaments.load', function() {

        var all = models.Ornament
            .loadAll()
            .then(function(list) {

                console.log(list);

                socket.emit('ornaments.list', {
                    list: list
                });

            });

    });

    // this will be connected to the sms service
    socket.on('ornament.add', function() {
        add({});
    });

});

exports.add = add;
