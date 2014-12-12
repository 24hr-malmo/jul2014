var fs = require('fs');
var async = require('async');
var path = require('path');
var realtime = require('../realtime');
var placePicker = require('./place-picker');
var models = require('../models');

var factor = 20;

function add(data) {

    models.Ornament

        .loadAll()
        .then(function(list) {

            return placePicker
                .pickPlace(list, factor)
                .then(function(place) {

                    if (place.free > 0) {

                        var displaceX = 10 * Math.random() - 5;
                        var displaceY = 10 * Math.random() - 5;

                        var displaceXPercent = (6 * Math.random() - 3) / place.width;
                        var displaceYPercent = (6 * Math.random() - 3) / place.height;

                        var ornament = new models.Ornament(data.name, data.type, place.slot.x + displaceX, place.slot.y + displaceY, place.slot.xPercent + displaceXPercent, place.slot.yPercent + displaceYPercent);

                        realtime.io.to('general').emit('ornament.added', ornament.getJSON());

                        return ornament.save()

                            // This is just to check how it looks
                            .then(function() {
                                return models.Ornament
                                    .loadAll()
                                    .then(function(list) {
                                        return placePicker
                                        .pickPlace(list, factor, true);

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
