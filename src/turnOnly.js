var fs = require("fs"),
    PNG = require('pngjs').PNG,
    actions = require('./actions.js'),
    getPixels = require('get-pixels'),
    savePixels = require("save-pixels"),
    height = 60,
    width = 180,
    myFile = fs.createWriteStream("/home/leena/Pictures/nuttie.png"),
    result = null,
    originalPixels = null;


function getLocation(x, y) {
    var idx = (width * y + x) << 2;
    return idx;
}

function getRgb(x, y) {
    var idx = (width * y + x) << 2;
    return {"r": originalPixels[idx], "g": originalPixels[idx+1], "b": originalPixels[idx+2]};
}

function color(idx, rgb) {
    result[idx] = rgb.r;
    result[idx+1] = rgb.g;
    result[idx+2] = rgb.b;
    result[idx+3] = 255;    //opacity or sth
}

function drawUp(x, y) {
    for (i = y; i <= height; i++) {
        console.log("draw up " + x + ", " + i);
        var rgb = getRgb(x, i);
        if (actions.stop(rgb)) {
            return;
        } else if (actions.turnLeft(rgb)) {
            //color here as well?
            drawLeft(x--, i);
        } else {
            var idx = getLocation(x, i);
            color(idx, {"r": 255, "g": 255, "b": 255});
        }
    }
}

function drawLeft(x, y) {
    for (i = x; i >= 0; i--) {
        console.log("draw left " + i + ", " + y);
        var rgb = getRgb(i, y);
        if (actions.stop(rgb)) {
            return;
        } else if (actions.turnRight(rgb)) {
            //color here as well?
            drawUp(i, y++);
        } else {
            var idx = getLocation(i, y);
            color(idx, {"r": 191, "g": 62, "b": 255})
        }
    }
}

function doSomething(x, y) {
    var rgb = getRgb(x, y);
    //if (actions.stop(rgb)) {
    //    return;
    //} else if (actions.turnLeft(rgb)) {                 //green
    //    var idx = getLocation(x, y);
    //    color(idx, {"r": 0, "g": 255, "b":0})
    //} else if (actions.turnRight(rgb)) {                //red
    //    var idx = getLocation(x, y);
    //    color(idx, {"r": 255, "g": 0, "b":0})
    if (actions.drawUp(rgb)) {                   //white
        console.log("Draw up!");
        var idx = getLocation(x, y);
        color(idx, {"r": 255, "g": 255, "b":255})
        drawUp(x, y);
    } else if (actions.drawLeft(rgb)) {                 //lilac
        console.log("Draw left!");
        var idx = getLocation(x, y);
        drawLeft(x, y);
    } else {
        var idx = getLocation(x, y);
        color(idx, {"r": 0, "g": 0, "b": 0});
    }
}

//fs.createReadStream('/home/leena/Pictures/nut.png')
//    .pipe(new PNG({
//        filterType: 4
//    }))
//    .on('parsed', function() {
//        getPixels('/home/leena/Pictures/nut.png', function(err, pixels){
//            originalPixels = pixels.data;
//            result = new Uint8Array(pixels.data.length);
//
//            for (var x = width; x >= 0; x--) {
//                for (var y = 0; y <= height; y++) {
//                    console.log(x + ", " + y);
//                    doSomething(x, y);
//                    //console.log("x:" + x + " y: " + y + " rgb: " + JSON.stringify(rgb));
//                }
//            }
//            pixels.data = result;
//            savePixels(pixels, "png").pipe(myFile);
//        });
//
//        //this.pack().pipe(fs.createWriteStream('/home/leena/Pictures/modifiednut.png'));
//    });

var x = 1,
    y = 2;

var mappy = new Map();

mappy[x+""+y] = "kukkuu";
mappy[y+""+x] = "kakkaa";

console.log(mappy);
console.log(Object.keys(mappy).length);
console.log(mappy[y+""+x]);

