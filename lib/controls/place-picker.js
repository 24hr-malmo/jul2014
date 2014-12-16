var fs = require('fs');
var async = require('async');
var path = require('path');
var Canvas = require('canvas');
var Image = Canvas.Image;
var Promise = require('es6-promise').Promise;
var collisionImagePath = path.join(__dirname, '../../public/assets/images/julgran-mask.png');
var deltaFactor = 25;

var img, width, height, canvas, ctx, imageData;

    var usedSlotsMap = {};
    var usedSlotsRefactored = [];

    var unusedSlots = [];

    var show = true;

    fs.readFile(collisionImagePath, function(err, buffer){
        if (err) throw err;

        img = new Image();
        img.src = buffer;

        width = Math.round(img.width / deltaFactor);
        height = Math.round(img.height / deltaFactor);

        canvas = new Canvas(width, height);
        ctx = canvas.getContext('2d');

        ctx.drawImage(img, 0, 0, width, height);

        imageData = ctx.getImageData(0, 0, width, height);

        var positions = [];

        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                var index = x + (y * width);
                var pixel = getPixel(imageData, index);
                var opaque = pixel[3] > 0;
                var visualize = opaque ? '+' : ' ';
                var positionKey = x + 'x' + y;

                if (opaque) {

                   var seed = Math.random();

                    unusedSlots.push({
                        x: x,
                        y: y,
                        //distance: distance,

                        // We pick a seed by multiplying the random number with the distance in square
                        // thereby making sure the distance has more impact.
                        seed: seed
                        //distance / seed
                    });


                } else if (usedSlotsMap[positionKey]) {
                    visualize = 'O';
                    positions.push(positionKey);
                }

                if (show) process.stdout.write(visualize);
                //pixel[3] + "");
            }
            //process.stdout.newLine();  // clear current text
            if (show) process.stdout.write('|');
            if (show) console.log();
        }

    });

function getPixel(imageData, index) {
    index = index * 4;
    return [
        imageData.data[index + 0],
        imageData.data[index + 1],
        imageData.data[index + 2],
        imageData.data[index + 3]
    ];
}

var placePicker = function() {

};

placePicker.pickPlace = function(usedSlots, show) {

    if (show) {
        process.stdout.write('\u001B[2J\u001B[0;0f');
    }

    return new Promise(function(resolve, reject) {

        if (show) console.log();

        //if (show) console.log(positions.join(','), width, height);

        // sort the list by its seed, making the furthest * furthest * random to pop
        /*unusedSlots.sort(function(a, b) {
            if (a.seed < b.seed) return 1;
            if (a.seed > b.seed) return -1;
            return 0;
            //return a.seed < b.seed;
            //return a.distance < b.distance;
        });*/

        //console.log(unusedSlots);


        // if we dont have any slots left, we need to tell it
        if (unusedSlots.length === 0) {

            return resolve({free: 0});

        } else {

            // now that we have a winner, lets get it
            //var slot = unusedSlots.shift();

            var randomIndex = Math.round(Math.random() * (unusedSlots.length - 1));

            var slot = unusedSlots.splice(randomIndex, 1)[0];

            // Make sure we reconvert it again to its correct place
            var orgX = slot.x;
            var orgY = slot.y;
            slot.x *= deltaFactor;
            slot.y *= deltaFactor;
            slot.xPercent = slot.x / img.width;
            slot.yPercent = slot.y / img.height;

            console.log('%s \t %s \t %s \t %s \t %s \t %s \t %s \t',  orgX, orgY, slot.x, slot.y, slot.xPercent, slot.yPercent, unusedSlots.length);
            return resolve({free: unusedSlots.length, slot: slot, width: width, height: height});

        }

    });


};

function calculateDistance(x, y, slots) {

    var distances = [];
    slots.forEach(function(slot) {
        var a = x - slot.x;
        var b = y - slot.y;
        var distance = Math.sqrt(a * a + b *b );
        distances.push(distance);
    });

    distances.sort(function(a, b) {
        if (a < b) return -1;
        if (a > b) return 1;
        return 1;
    });

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
