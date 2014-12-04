var zmq = require('zmq');
var zonar = require('zonar');
//var helper = require('service.helper');
var ornamentsControl = require('./ornaments');

var z = zonar.create({ net : '24hr', name: 'jul-sms'});

//helper.handleInterrupt(z);

z.start(function(err) {

    if (err) throw err;

    console.log('started');

    z.on('found', function(zonarItem) {
        console.log(zonarItem);
    });

    var zocket = zmq.socket('sub');
    zocket.connect('tcp://localhost:6010');

    zocket.subscribe('all');
    zocket.on('message', function(message) {
        var json = JSON.parse(message.toString().replace(/^[\w\s]+/,''));

        var type = 'foo';
        switch(json.message) {
            case 'bar': type = 'bar'; break;
            case 'baq': type = 'baq'; break;
            case 'baz': type = 'baz'; break;
        }

        ornamentsControl.add({phone: json.from, name: json.name, type: type});
    });
    zocket.on('error', function(message) {
        console.log(message.toString());;
    });

    return;


    helper.getService(z, 'sms.pub', function(err, subSock) {

        console.log("CONNECTEd");

        if (err) throw err;

        subSock.subscribe('');

        var proximityValues = {};

        subSock.on('message', function(message) {
            console.log(message.toString());
        });

    });

});





