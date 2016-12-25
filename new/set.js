var fs = require("fs"),
    PNG = require('pngjs').PNG,
    actions = require('../src/actions.js'),
    getPixels = require('get-pixels'),
    savePixels = require("save-pixels"),
    PngImg = require('png-img'),
    height = 60,
    width = 180,
    result = null,
    originalPixels = null,
    buf = fs.readFileSync('/home/leena/Pictures/nut.png'),
    img = new PngImg(buf);


function getRgb(x, y) {
    console.log("GET " + x + ", " +y);
    return img.get(x, y);
}

function color(x, y, rgb) {
    console.log("Setting " + x + ", " + y + " : " + JSON.stringify(rgb));
    img.set(x, y, rgb);
}

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
        color(x, y, {r: 255, g: 0, b:0, a:255});
        return;
    } else if (actions.turnLeft(rgb)) {                 //green
        color(x, y, {r: 0, g: 255, b:0, a:255});
    } else if (actions.turnRight(rgb)) {                //red
        color(x, y, {r: 255, g: 0, b:0, a:255});
    } else if (actions.drawUp(rgb)) {                   //white
        console.log("Draw up!");
        color(x, y, {r: 255, g: 255, b:255, a:255});
        //drawUp(x, y);
    } else if (actions.drawLeft(rgb)) {                 //lilac
        console.log("Draw left!");
        color(x, y, {r: 191, g: 62, b:255, a:255});
        //drawLeft(x, y);
    } else {
        color(x, y, {r: 0, g: 0, b:0, a:255});
    }
}



function run() {
    for (var x = (width-1); x >= 0; x--) {
        for (var y = 0; y < height; y++) {
            //console.log(x + ", " + y);
            doSomething(x, y);
            //console.log("x:" + x + " y: " + y + " rgb: " + JSON.stringify(rgb));
        }
    }

    img.save('/home/leena/Pictures/newnut.png', function(error) {
        if(error) {
            console.error('Error:', error);
        } else {
            console.log('OK');
        }
    });
}

run();
