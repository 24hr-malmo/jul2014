var db = require('../db');
var Promise = require('es6-promise').Promise;

var Ornament = function(name, type, x, y, xPercent, yPercent, phone) {
    this.name = name;
    this.type = type;
    this.phone = phone;
    this.x = x;
    this.y = y;
    this.xPercent = xPercent;
    this.yPercent = yPercent;
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
    json.xPercent = this.xPercent;
    json.yPercent = this.yPercent;

    return json;

}

module.exports = Ornament;

