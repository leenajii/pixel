var fs = require('fs'),
    PNG = require('pngjs').PNG;

fs.createReadStream('/home/leena/Pictures/nut.png')
    .pipe(new PNG({
        filterType: 4
    }))
    .on('parsed', function() {

        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                var idx = (this.width * y + x) << 2;
                    checkColor(this.data, this.width, this.height, idx, y, x);
            }
        }

        this.pack().pipe(fs.createWriteStream('/home/leena/Pictures/modifiednut.png'));
    });

function checkColor(data, width, height, idx, y, x) {
    console.log("checkColor x: " + x + " y: " + y + " idx: " + idx);
    if (data[idx] === 7 && data[idx + 1] === 84 && data[idx + 2] === 19) {
        drawUp(data, width, height, y, x);
    }
    if (data[idx] === 139 && data[idx + 1] === 57 && data[idx + 2] === 137) {
        drawLeft(data, width, height, y, x)
    }
    if (data[idx] === 182 && data[idx + 1] === 149 && data[idx + 2] === 72) {
        drawOneRight(data, width, y, x);
    }
    if (data[idx] === 123 && data[idx + 1] === 131 && data[idx + 2] === 154) {
        drawOneLeft(data, width, y, x);
    }
}
function drawOneRight(data, width, sub_y, sub_x) {
    console.log("> -- x: " + sub_x + " y: " + sub_y);
        var sub_idx = getXLocation(sub_x++, sub_y++, width);
        if (data[sub_idx] === 51 && data[sub_idx + 1] === 69 && data[sub_idx + 2] === 169) {
            return;
        } else {
            colorWhite(data, sub_idx, sub_idx+1, sub_idx+2);
        }
}

function drawOneLeft(data, width, sub_y, sub_x) {
    console.log("< -- x: " + sub_x + " y: " + sub_y);
    var sub_idx = getXLocation(sub_x--, sub_y--, width);
    if (data[sub_idx] === 51 && data[sub_idx + 1] === 69 && data[sub_idx + 2] === 169) {
        return;
    } else {
        colorWhite(data, sub_idx, sub_idx+1, sub_idx+2);
    }
}

function drawUp(data, width, height, sub_y, sub_x) {
    console.log("^^^ -- x: " + sub_x + " y: " + sub_y);
    for (sub_y; sub_y < height; sub_y++) {
        var sub_idx = getXLocation(sub_x, sub_y, width);
        if (data[sub_idx] === 51 && data[sub_idx + 1] === 69 && data[sub_idx + 2] === 169) {
            return;
        } else {
            colorWhite(data, sub_idx, sub_idx+1, sub_idx+2);
            checkColor(data, width, height, sub_idx, sub_y, sub_x);
        }
    }
}

function drawRight(data, width, height, sub_y, sub_x) {
    console.log(">>> -- x: " + sub_x + " y: " + sub_y);
    for (sub_x; sub_x < width; sub_x++) {
        var sub_idx = getXLocation(sub_x, sub_y, width);
        if (data[sub_idx] === 51 && data[sub_idx + 1] === 69 && data[sub_idx + 2] === 169) {
            return;
        } else {
            colorWhite(data, sub_idx, sub_idx+1, sub_idx+2);
            checkColor(data, width, height, sub_idx, sub_y, sub_x);
        }
    }
}

function drawLeft(data, width, height, sub_y, sub_x) {
    console.log("<<< -- x: " + sub_x + " y: " + sub_y);
    for (sub_x; sub_x > 0; sub_x--) {
        var sub_idx = getXLocation(sub_x, sub_y, width);
        if (data[sub_idx] === 51 && data[sub_idx + 1] === 69 && data[sub_idx + 2] === 169) {
            return;
        } else {
            colorWhite(data, sub_idx, sub_idx+1, sub_idx+2);
            checkColor(data, width, height, sub_idx, sub_y, sub_x);
        }
    }
}

function getXLocation(x, y, width) {
    var result = (width * y + x) << 2;
    console.log("Calc -- width: " + width + " x: " + x + " y: " + y + " = " + result);
    return result;
}

function colorWhite(data, r, g, b) {
    console.log("RGB: " + r + "," + g + "," + b);
    data[r] = 255;
    data[g] = 255;
    data[b] = 255;
}

/*Ala piirtää ylöspäin, kun pikselin väri on 7, 84, 19.
Ala piirtää vasemmalle, kun pikselin väri on 139, 57, 137.
Lopeta viivan piirtäminen, kun pikselin väri on 51, 69, 169.
Käänny oikealle, kun pikselin väri on 182, 149, 72.
Käänny vasemmalle, kun pikselin väri on 123, 131, 154.*/
