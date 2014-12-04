var fs = require('fs');
var async = require('async');
var path = require('path');
var realtime = require('../realtime');
var placePicker = require('./place-picker');
var models = require('../models');

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

    socket.on('ornament.add', function() {


        var all = models.Ornament
            .loadAll()
            .then(function(list) {


                return placePicker
                    .pickPlace(list, 10)
                    .then(function(place) {

                        if (place.free > 0) {
                            var ornament = new models.Ornament('foo', 'bar', place.slot.x, place.slot.y);
                            socket.emit('ornament.added', ornament.getJSON());
                            return ornament
                                .save()


                                // This is just to check how it looks
                                .then(function() {

                                    return models.Ornament
                                        .loadAll()
                                        .then(function(list) {
                                            return placePicker
                                            .pickPlace(list, 10, true);

                                        });
                                });
                        }

                    });

            });



    });

});
