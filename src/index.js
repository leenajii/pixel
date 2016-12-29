var fs = require('fs'),
    PNG = require('pngjs').PNG
    result = [];

fs.createReadStream('/home/leena/Pictures/nut.png')
    .pipe(new PNG({
        filterType: 4
    }))
    .on('parsed', function() {
        fs.writeFile("/tmp/test", "" + this.data, function(err) {
            if(err) {
                return console.log(err);
            }

            console.log("The file was saved!");
        });
        for (var y = 0; y < this.height; y++) {
            for (var x = this.width; x >= 0; x--) {
                var idx = (this.width * y + x) << 2;
                    checkColor([], this.data, this.width, this.height, idx, y, x);
            }
        }

        this.pack().pipe(fs.createWriteStream('/home/leena/Pictures/modifiednut.png'));
    });

function checkColor(resultArray, data, width, height, idx, y, x) {
    var res1;
    console.log("checkColor x: " + x + " y: " + y + " idx: " + idx);
    if (data[idx] === 7 && data[idx + 1] === 84 && data[idx + 2] === 19) {
        drawUp(data, resultArray, width, height, y, x);
    } else if (data[idx] === 139 && data[idx + 1] === 57 && data[idx + 2] === 137) {
        drawLeft(data, resultArray, width, height, y, x)
    } else if (data[idx] === 182 && data[idx + 1] === 149 && data[idx + 2] === 72) {
        drawOneRight(data, resultArray, width, y, x);
    } else if (data[idx] === 123 && data[idx + 1] === 131 && data[idx + 2] === 154) {
        drawOneLeft(data, resultArray, width, y, x);
    } else {
        res1 = storeColor(resultArray, idx, getRgb(data, idx));
    }
    return res1;
}

function getRgb(pixels, idx) {
    var rgb = {"r": pixels[idx], "g": pixels[idx+1], "b": pixels[idx+2]};
    return rgb;
}

function storeColor(newData, o_idx, rgb) {
    var newArr = [];
    newArr.splice(o_idx, 0, rgb.r);
    newArr.splice(o_idx+1, 0, rgb.g);
    newArr.splice(o_idx+2, 0, rgb.b);
    newArr.splice(o_idx+3, 0, 255);
    console.log("newArr: " + newArr);
    console.log("Result: " + newData);
    return newData.concat(newArr)
}

function drawOneRight(data, res1R, width, sub_y, sub_x) {
    console.log("> -- x: " + sub_x + " y: " + sub_y);
        var sub_idx = getXLocation(sub_x++, sub_y, width);
        if (data[sub_idx] === 51 && data[sub_idx + 1] === 69 && data[sub_idx + 2] === 169) {
            return;
        } else {
            colorWhite(data, res1R, sub_idx, sub_idx+1, sub_idx+2);
        }
}

function drawOneLeft(data, res1L, width, sub_y, sub_x) {
    console.log("< -- x: " + sub_x + " y: " + sub_y);
    var sub_idx = getXLocation(sub_x--, sub_y, width);
    if (data[sub_idx] === 51 && data[sub_idx + 1] === 69 && data[sub_idx + 2] === 169) {
        return;
    } else {
        colorWhite(data, res1L, sub_idx, sub_idx+1, sub_idx+2);
    }
}

function drawUp(data, resU, width, height, sub_y, sub_x) {
    console.log("^^^ -- x: " + sub_x + " y: " + sub_y);
    for (sub_y; sub_y < height; sub_y++) {
        var sub_idx = getXLocation(sub_x, sub_y, width);
        colorWhite(data, resU, sub_idx, sub_idx+1, sub_idx+2);
        checkColor(data, width, height, sub_idx, sub_y, sub_x);
    }
}

function drawRight(data, resR, width, height, sub_y, sub_x) {
    console.log(">>> -- x: " + sub_x + " y: " + sub_y);
    for (sub_x; sub_x < width; sub_x++) {
        var sub_idx = getXLocation(sub_x, sub_y, width);
        colorWhite(data, resR, sub_idx, sub_idx+1, sub_idx+2);
        checkColor(data, width, height, sub_idx, sub_y, sub_x);
    }
}

function drawLeft(data, resL, width, height, sub_y, sub_x) {
    console.log("<<< -- x: " + sub_x + " y: " + sub_y);
    for (sub_x; sub_x > 0; sub_x--) {
        var sub_idx = getXLocation(sub_x-1, sub_y, width);
        colorWhite(data, resL, sub_idx, sub_idx+1, sub_idx+2);
        checkColor(data, width, height, sub_idx, sub_y, sub_x);
    }
}

function getXLocation(x, y, width) {
    var result = (width * y + x) << 2;
    console.log("Calc -- width: " + width + " x: " + x + " y: " + y + " = " + result);
    return result;
}

function colorWhite(data, resW, r, g, b) {
    if (data[r] === 51 && data[g] === 69 && data[b] === 169) {
        return;
    } else {
        storeColor(resW, r, {"r": 255, "g": 255, "b": 255});
        console.log("RGB: " + r + "," + g + "," + b);
        data[r] = 255;
        data[g] = 255;
        data[b] = 255;
    }
}

/*Ala piirtää ylöspäin, kun pikselin väri on 7, 84, 19.
Ala piirtää vasemmalle, kun pikselin väri on 139, 57, 137.
Lopeta viivan piirtäminen, kun pikselin väri on 51, 69, 169.
Käänny oikealle, kun pikselin väri on 182, 149, 72.
Käänny vasemmalle, kun pikselin väri on 123, 131, 154.*/
