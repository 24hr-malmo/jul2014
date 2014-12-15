var zmq = require('zmq');
var zonar = require('zonar');
var ornamentsControl = require('./ornaments');

var z = zonar.create({ net : '24hr', name: 'jul-sms-jeppe'});

z.start(function(err) {

    if (err) throw err;

    var zocket = zmq.socket('sub');

    z.on('found.sms', function(zonarItem) {
        console.log("CONNECT TO SMS SERVICE");
        zocket.connect('tcp://' + zonarItem.address + ':' + zonarItem.payload.pub);
    });

    z.on('dropped.sms', function(zonarItem) {
        console.log("DISCONNECT FROM SMS SERVICE");
        zocket.disconnect('tcp://' + zonarItem.address + ':' + zonarItem.payload.pub);
    });

    zocket.subscribe('all');
    zocket.on('message', function(message) {
        var json = JSON.parse(message.toString().replace(/^[\w\s]+/,''));

        console.log("SMS:", json);

        var type = '';
        switch(json.message.toLowerCase()) {
            case 'kula1': type = 'kula1'; break;
            case 'ljus': type = 'ljus'; break;
            case 'kula2': type = 'kula2'; break;
            case 'polka': type = 'polka'; break;
        }

        if (type != '') {
            ornamentsControl.add({phone: json.from, name: json.name, type: type});
        }
    });

    zocket.on('error', function(message) {
        //console.log(message.toString());;
    });


});





