var getPixels = require('get-pixels');

var pixelGetter = function(filePath, res){
  getPixels(filePath, function(err, pixels){
    if (err){
      console.log(err);
      return;
    } else {
      console.log("Data:" + pixels.data);
      var pixel = getRgb(pixels, 0, 0)
      console.log("1 pixel: " +  pixel.r);
      return pixels;
    }
  });
  console.log("Pixels: " + res);
  return res;
}

function getRgb(data, x, y) {
    return {"r": data.get(x,y,0), "g": data.get(x,y,1), "b": data.get(x,y,2)};
}

var pixelArray = pixelGetter('/home/leena/Pictures/nut.png');

//for (var y = 0; y < pixelArray.length; y++){
  //for (var x = 0; x < pixelArray.length; x++){
  //}
//}