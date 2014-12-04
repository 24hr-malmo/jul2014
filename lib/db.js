var levelup = require('levelup');

//var db = levelup('../data/db');

var db = {

    data: {},

    put: function(key, value, next) {
        db.data[key] = value;
        next(null);
    },

    get: function(key, next) {
        next(null, db.data[key]);
    }

};

module.exports = db;
