var fs = require('fs');
var async = require('async');
var path = require('path');
var Canvas = require('canvas');
var Image = Canvas.Image;
var Promise = require('es6-promise').Promise;
var collisionImagePath = path.join(__dirname, '../../masks/realtree.png');

function getPixel(imageData, index) {
    var index = index * 4;
    return [
        imageData.data[index + 0],
        imageData.data[index + 1],
        imageData.data[index + 2],
        imageData.data[index + 3]
    ];
}



var placePicker = function() {

};

placePicker.pickPlace = function(usedSlots, deltaFactor, show) {

    return new Promise(function(resolve, reject) {

    deltaFactor = deltaFactor || 1;

    var usedSlotsMap = {};
    var usedSlotsRefactored = [];
    usedSlots.forEach(function(used) {
        var x = Math.floor(used.x / deltaFactor);
        var y = Math.floor(used.y / deltaFactor);
        var positionKey = x + 'x' + y;
        usedSlotsMap[positionKey] = true;
        usedSlotsRefactored.push({ x: x, y: y });
    });

    var unusedSlots = [];


    fs.readFile(collisionImagePath, function(err, buffer){

        if (err) throw err;

        var img = new Image();
        img.src = buffer;

        var width = Math.floor(img.width / deltaFactor);
        var height = Math.floor(img.height / deltaFactor);

        var canvas = new Canvas(width, height);
        var ctx = canvas.getContext('2d');

        ctx.drawImage(img, 0, 0, width, height); 

        var imageData = ctx.getImageData(0, 0, width, height);

        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                var index = x + (y * width);
                var pixel = getPixel(imageData, index);
                var opaque = pixel[3] > 0;
                var visualize = opaque ? '+' : ' ';
                var positionKey = x + 'x' + y;
                if (opaque && !usedSlotsMap[positionKey]) {


                    var distance = usedSlotsRefactored.length == 0 ? 1 : calculateDistance(x, y, usedSlotsRefactored);
                    var seed = Math.random();

                    unusedSlots.push({
                        x: x, 
                        y: y, 
                        distance: distance,

                        // We pick a seed by multiplying the random number with the distance in square
                        // thereby making sure the distance has more impact.
                        seed: distance * seed
                        //distance / seed 
                    });


                } else if (usedSlotsMap[positionKey]) {
                    visualize = 'O';
                }

                if (show) process.stdout.write(visualize);
                //pixel[3] + "");
            }
            //process.stdout.newLine();  // clear current text
            if (show) console.log();
        }

        if (show) console.log();

        // sort the list by its seed, making the furthest * furthest * random to pop
        unusedSlots.sort(function(a, b) {
            if (a.seed < b.seed) return 1;
            if (a.seed > b.seed) return -1;
            return 0;
            //return a.seed < b.seed;
            //return a.distance < b.distance;
        });

        //console.log(unusedSlots);


        // if we dont have any slots left, we need to tell it
        if (unusedSlots.length == 0) {

            return resolve({free: 0});

        } else {

            // now that we have a winner, lets get it
            var slot = unusedSlots.shift();

            // Make sure we reconvert it again to its correct place
            slot.x *= deltaFactor;
            slot.y *= deltaFactor;
            return resolve({free: unusedSlots.length, slot: slot, width: width, height: height});

        };

    });

    });

}

function calculateDistance(x, y, slots) {

    var distances = []; 
    slots.forEach(function(slot) {
        var a = x - slot.x;
        var b = y - slot.y;
        var distance = Math.sqrt(a * a + b *b );
        distances.push(distance);
    });

    distances.sort();

    return distances.shift();
    
}

/*
var tempList = [];
for (var i = 0; i < 1; i++) {
    tempList.push(1);
}
var used = [];
async.eachSeries(tempList, function(item, next) {
    placePicker.pickPlace(used, collisionImagePath, 10, function(picked) {
        if (picked.free > 0) {
            used.push(picked.slot);
            next();
        } else {
            next('full');
        }
    });
}, function(err) {
    console.log(err);
});
*/

module.exports = placePicker;
