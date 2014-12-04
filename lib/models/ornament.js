var db = require('../db');
var Promise = require('es6-promise').Promise;

var Ornament = function(name, type, x, y) {
    this.name = name;
    this.type = type;
    this.x = x;
    this.y = y;
};

Ornament.prototype.save = function() {

    var self = this;

    return Ornament
        .loadAll()
        .then(function(list) {
            list.push(self);
            return Ornament.saveAll(list);
        });

}

Ornament.saveAll = function(list) {

    return new Promise(function(resolve, reject) {

        db.put('ornaments', list, { valueEncoding: 'json'} ,function(err, list) {
            if (err) {
                return reject(err);
            }
            resolve(true); 
        });

    });

};

Ornament.loadAll = function() {

    return new Promise(function(resolve, reject) {

        db.get('ornaments', { valueEncoding: 'json'}, function(err, list) {
            return resolve(list || []); 
        });

    });

};

Ornament.prototype.getJSON = function() {

    var json = {};

    json.name = this.name;
    json.type = this.type;
    json.x = this.x;
    json.y = this.y;

    return json;

}

module.exports = Ornament;

