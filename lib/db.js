var levelup = require('levelup');

//var db = levelup('../data/db');

var db = {

    data: {},

    put: function(key, value, next) {
        data[key] = value;
        next();
    },

    get: function(key, next) {
        next(data[key]);
    }

};

module.exports = db;
