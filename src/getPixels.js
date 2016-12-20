var fs = require("fs"),
PNG = require('pngjs').PNG,
    getPixels = require('get-pixels'),
    savePixels = require("save-pixels"),
    height = 60,
    width = 180,
    myFile = fs.createWriteStream("/home/leena/Pictures/modifiednut.png");

fs.createReadStream('/home/leena/Pictures/nut.png')
    .pipe(new PNG({
        filterType: 4
    }))
    .on('parsed', function() {
        pixelGetter('/home/leena/Pictures/nut.png', function(err, pixels){
            for (var y = 0; y < this.height; y++) {
                for (var x = 0; x < this.width; x++) {
                    var idx = (this.width * y + x) << 2;
                        checkColor(pixels, getRgb(pixels, x, y), x, y);
                }
            }
            });

        this.pack().pipe(fs.createWriteStream('/home/leena/Pictures/modifiednut.png'));
    });

var pixelGetter = function(filePath, res){
  getPixels(filePath, function(err, pixels){
    if (err){
      console.log(err);
      return;
    } else {
      for (var y = 0; y < height; y++){
        for (var x = 0; x < width; x++){
          checkColor(pixels, getRgb(pixels, x, y), x, y);
          console.log("RGB: " + getRgb(pixels, x, y), x, y);
        }
      }
      savePixels(pixels, "png").pipe(myFile);
      return pixels;
    }
  });
  console.log("Pixels: " + res);
  return res;
}

function checkColor(data, rgb, x, y) {
    console.log("checkColor x: " + x + " y: " + y + " rgb: " + rgb);
    if (rgb.r === 7 && rgb.g === 84 && rgb.b === 19) {
        drawUp(data, y, x);
    }
    if (rgb.r === 139 && rgb.g === 57 && rgb.b === 137) {
        drawLeft(data, y, x)
    }
    if (rgb.r === 182 && rgb.g === 149 && rgb.b === 72) {
        drawOneRight(data, y, x);
    }
    if (rgb.r === 123 && rgb.g === 131 && rgb.b === 154) {
        drawOneLeft(data, y, x);
    }
}

function drawOneRight(data, sub_y, sub_x) {
    console.log("> -- x: " + sub_x + " y: " + sub_y);
    var sub_rgb = getRgb(data, sub_x, sub_y);
    colorWhite(data, sub_x, sub_y);
    colorWhite(data, sub_x+1, sub_y);
}

function drawOneLeft(data, sub_y, sub_x) {
    console.log("< -- x: " + sub_x + " y: " + sub_y);
    var sub_rgb = getRgb(data, sub_x, sub_y);
    colorWhite(data, sub_rgb, sub_x, sub_y);
    colorWhite(data, sub_rgb, sub_x-1, sub_y);
}

function drawUp(data, up_y, up_x) {
    console.log("^^^ -- x: " + up_x + " y: " + up_y);
    for (up_y; up_y < height; up_y++) {
        var up_rgb = getRgb(data, up_x, up_y);
        if (up_rgb.r ===  51 && up_rgb.g === 69 && up_rgb.b === 169) {
            return;
        } else {
            colorWhite(data, up_rgb, up_x, up_y);
            checkColor(data, up_y, up_x);
        }
    }
}

function drawLeft(data, left_y, left_x) {
    console.log("^^^ -- x: " + left_x + " y: " + left_y);
    for (left_y; left_y < height; left_y++) {
        var left_rgb = getRgb(data, left_x, left_y);
        if (left_rgb.r ===  51 && left_rgb.g === 69 && left_rgb.b === 169) {
            return;
        } else {
            colorWhite(data, left_rgb, left_x, left_y);
            checkColor(data, left_y, left_x);
        }
    }
}

function getRgb(pixels, x, y) {
    var rgb = {"r": pixels.get(x,y,0), "g": pixels.get(x,y,1), "b": pixels.get(x,y,2)};
    return rgb;
}

function colorWhite(data, rgb, col_x, col_y) {
    if (rgb.r ===  51 && rgb.g === 69 && rgb.b === 169) {
        return;
    } else {
        var idx = (width * col_y + col_x) << 2;
        data[idx] = 255;
        data[idx+1] = 255;
        data[idx+2] = 255;
    }
}


