var fs = require("fs"),
    PNG = require('pngjs').PNG,
    actions = require('./actions.js'),
    getPixels = require('get-pixels'),
    savePixels = require("save-pixels"),
    height = 60,
    width = 180,
    myFile = fs.createWriteStream("/home/leena/Pictures/nuttie.png"),
    result = null,
    written = null,
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
    if (!written[idx]) {
        result[idx] = rgb.r;
        written[idx] = true;
    }
    if (!written[idx + 1]){
        result[idx + 1] = rgb.g;
        written[idx + 1] = true;
    }
    if (!written[idx+2]) {
        result[idx + 2] = rgb.b;
        written[idx+2] = true;
    } if (!written[idx+3]) {
        result[idx + 3] = 255;    //opacity or sth
        written[idx+3] = true;
    }
}

function drawDown(x, y) {
    for (i = y; i >= 0; i--) {
        console.log("draw dwn " + x + ", " +i);
        var rgb = getRgb(x, i);
        if (!actions.stop(rgb)) {
            var idx = getLocation(x, i);
            color(idx, {"r": 255, "g": 255, "b":255});
            if (actions.turnLeft(rgb)) {
                drawRight(x++, i);
            } else if (actions.turnRight(rgb)) {
                drawLeft(x--, i);
            }
        } else {
            return;
        }
    }
}

function drawRight(x, y) {
    console.log("\n\n ***************** RIGHT ****************");
    for (i = x; i <= width; i++) {
        console.log("right " + i + ", " +y);
        var rgb = getRgb(i, y);
        if (!actions.stop(rgb)) {
            //if (actions.turnRight(rgb)) {
            //    console.log("Turn right --> up");
            //    drawUp(i, y++);
            //} else {
                var idx = getLocation(i, y);
                console.log("Color red " + i + ", " + y);
                color(idx, {"r": 255, "g": 0, "b":22});
           // }
        } else {
            console.log("------Stop right");
            return;
        }
    }
    console.log("----- Iterated through right");
}

//----------------------

function drawUp(x, y) {
    console.log("\n\n ***************** UP ****************");
    for (i = y; i <= height; i++) {
        console.log("up " + x + ", " +i);
        var rgb = getRgb(x, i);
        if (!actions.stop(rgb)) {
            var idx = getLocation(x, i);
            console.log("get location " + x + ", " +i + " = " + idx);
            color(idx, {"r": 255, "g": 255, "b": 255});
            //if (actions.turnLeft(rgb)) {
            //    console.log("Turn left");
            //    drawLeft(x, i);
            //} else if (actions.turnRight(rgb)) {
            //    console.log("Turn right");
            //    drawRight(x, i);
            //}
        } else {
            console.log("-----STOP UP");
            return;
        }
    }
    console.log("----- Iterated through up");
}

function drawLeft(x, y) {
    console.log("\n\n ***************** LEFT ****************");
    for (i = x; i >= 0; i--) {
        console.log("left " + i + ", " +y);
        var rgb = getRgb(i, y);
        if (!actions.stop(rgb)) {
            if (actions.turnRight(rgb)) {
                console.log("Turn right --> up");
                drawUp(i, y++);
            }
            //} else {
            //    var idx = getLocation(i, y);
            //    console.log("Color lilac " + i + ", " + y);
            //    color(idx, {"r": 191, "g": 62, "b":255});
            //}
        } else {
            console.log("------Stop left");
            return;
        }
    }
    console.log("----- Iterated through left");
}

function doSomething(x, y) {
    var rgb = getRgb(x, y);
    if (actions.stop(rgb)) {
        var idx = getLocation(x--, y);
        color(idx, {"r": 255, "g": 255, "b":0})
        return;
    } else if (actions.turnLeft(rgb)) {                 //green
        var idx = getLocation(x--, y);
        color(idx, {"r": 0, "g": 255, "b":0})
    } else if (actions.turnRight(rgb)) {                //red
        var idx = getLocation(x++, y);
        color(idx, {"r": 255, "g": 0, "b":0})
    } else if (actions.drawUp(rgb)) {                   //white
        console.log("Draw up!");
        var idx = getLocation(x, y);
        color(idx, {"r": 255, "g": 255, "b":255})
        drawUp(x, y);
    } else if (actions.drawLeft(rgb)) {                 //lilac
        console.log("Draw left!");
        var idx = getLocation(x, y);
        color(idx, {"r": 191, "g": 62, "b":255});
        //drawLeft(x, y);
    } else {
        var idx = getLocation(x, y);
        color(idx, {"r": 0, "g": 0, "b": 0});
    }
}

fs.createReadStream('/home/leena/Pictures/nut.png')
    .pipe(new PNG({
        filterType: 4
    }))
    .on('parsed', function() {
        getPixels('/home/leena/Pictures/nut.png', function(err, pixels){
            originalPixels = pixels.data;
            result = new Uint8Array(pixels.data.length);
            written = new Array(pixels.data.length);

            for (var x = width; x >= 0; x--) {
                for (var y = 0; y <= height; y++) {
                    //console.log(x + ", " + y);
                    doSomething(x, y);
                    //console.log("x:" + x + " y: " + y + " rgb: " + JSON.stringify(rgb));
                }
            }
            pixels.data = result;
            savePixels(pixels, "png").pipe(myFile);
        });

        //this.pack().pipe(fs.createWriteStream('/home/leena/Pictures/modifiednut.png'));
    });

