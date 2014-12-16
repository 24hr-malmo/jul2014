var fs = require('fs');
var async = require('async');
var path = require('path');
var realtime = require('../realtime');
var placePicker = require('./place-picker');
var models = require('../models');

function add(data) {

    return models.Ornament

        .loadAll()
        .then(function(list) {

            return placePicker
                .pickPlace(list)
                .then(function(place) {

                    var already = false;
                    list.forEach(function(item) {
                        console.log(item.name, item.phone);
                        if (item.phone == data.phone) {
                            already = true;
                        }
                    });

                    if (already) {
                        console.log('Number %s has already sent a message', data.phone);
                        return;
                    }

                    if (place.free > 0) {

                        var displaceX = 10 * Math.random() - 5;
                        var displaceY = 10 * Math.random() - 5;

                        var displaceXPercent = (1 * Math.random() - 0.5) / place.width;
                        var displaceYPercent = (1 * Math.random() - 0.5) / place.height;

                        var ornament = new models.Ornament(data.name, data.type, place.slot.x + displaceX, place.slot.y + displaceY, place.slot.xPercent + displaceXPercent, place.slot.yPercent + displaceYPercent, data.phone);

                        realtime.io.to('general').emit('ornament.added', ornament.getJSON());



                        return ornament.save()

                            // This is just to check how it looks
                            .then(function() {
                                return models.Ornament
                                    .loadAll()
                                    .then(function(list) {
                                        return placePicker;
                                        //.pickPlace(list, true);

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
