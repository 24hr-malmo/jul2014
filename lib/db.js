var levelup = require('level');
var mkdirp = require('mkdirp');
var path = require('path');

var dataPath = path.join(__dirname, '../data');
mkdirp.sync(dataPath);

var db = levelup(dataPath + '/db');
/*
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
*/
module.exports = db;
