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
    img = new PngImg(buf),
    processed = new Map();


function getRgb(x, y) {
    return img.get(x, y);
}

function setProcessed(x, y) {
    var xy = x + "," + y;
    if (processed[xy]) {
        processed[xy] = processed[xy] + 1;
    } else {
        processed[xy] = 1;
    }
}

function color(x, y, rgb) {
    //console.log("Setting " + x + ", " + y + " : " + JSON.stringify(rgb));
    setProcessed(x, y);
    img.set(x, y, rgb);
}

function drawUp(x, y) {
    for (i = y; i < height; i++) {
        var rgb = getRgb(x, i);
        if (!actions.stop(rgb)) {
            color(x, i, {r: 0, g: 0,  b:  0, a: 255});
            if (actions.turnLeft(rgb)) {
                drawLeft(x, i);
            }
            //if (actions.turnRight(rgb)) {
            //    drawRight(x, i);
            //}
        } else {
            i = height + 1;
            return;
        }
    }
}

function drawDown(x, y) {
    for (i = y; i >=0; i--) {
        var rgb = getRgb(x, i);
        if (!actions.stop(rgb)) {
            color(x, i, {r: 0, g: 0,  b:  0, a: 255});
            if (actions.turnLeft(rgb)) {
                drawLeft(x, i);
            }
            //if (actions.turnRight(rgb)) {
            //    drawRight(x, i);
            //}
        } else {
            i=-1;
            return;
        }
    }
}

function drawLeft(x, y) {
    for (i = x; i >= 0; i--) {
        var rgb = getRgb(i, y);
        if (!actions.stop(rgb)) {
            color(i, y, {r: 0, g: 0,  b:  0, a: 255});
            if (actions.turnRight(rgb)) {
                console.log("Turn right --> up");
                drawUp(i, y);
            }
            //if (actions.turnLeft(rgb)) {
            //    console.log("Turn left --> down");
            //    drawDown(i, y);
            //}
        } else {
            i=-1;
            return;
        }
    }
}

function doSomething(x, y) {
    var rgb = getRgb(x, y);
    if (actions.drawUp(rgb)) {
        color(x, y, {r: 0, g: 0, b: 0, a: 255});
        drawUp(x, y);
    } else if (actions.drawLeft(rgb)) {
        color(x, y, {r: 0, g: 0,  b:  0, a: 255});
        drawLeft(x, y);
    } else {
        color(x, y, {r: 255, g: 255,  b:  255, a: 255});
    }
}



function run() {
    for (var x = (width-1); x >= 0; x--) {
        for (var y = 0; y < height; y++) {
            doSomething(x, y);
        }
    }

    img.save('/home/leena/Pictures/startatpoint2.png', function(error) {
        if(error) {
            console.error('Error:', error);
        } else {
            console.log('OK');
        }
    });
}

run();
Object.keys(processed).forEach(function(key) {
    var value = processed[key];
    console.log(key + ": " + value);
});

console.log(processed);
console.log(Object.keys(processed).length);
console.log(width*height);
