var fs = require("fs"),
    PNG = require('pngjs').PNG,
    getPixels = require('get-pixels'),
    savePixels = require("save-pixels"),
    height = 60,
    width = 180,
    myFile = fs.createWriteStream("/home/leena/Pictures/newnut.png");

function read() {
    var data = fs.readFileSync('/home/leena/github/clj-pixel/resources/result', 'utf8');
        return data;
}

fs.createReadStream('/home/leena/Pictures/nut.png')
    .pipe(new PNG({
        filterType: 4
    }))
    .on('parsed', function() {
        getPixels('/home/leena/Pictures/nut.png', function(err, pixels){
            this.data = JSON.parse(read());
            console.log("JSON: " + this.data);

            pixels.data = new Uint8Array(this.data.length);
            for (var i=0; i < pixels.data.length; i++) {
                pixels.data[i] = this.data[i];
            }

            console.log("Data from read: " + (typeof this.data));
            console.log(pixels);

            savePixels(pixels, "png").pipe(myFile);

            //fs.writeFile("/home/leena/Pictures/newnut.png", pixels.data, function(err) {
            //    if(err) {
            //        return console.log(err);
            //    }
            //    console.log("The file was saved!");
            //});
        });
        this.pack().pipe(fs.createWriteStream('/home/leena/Pictures/modifiednut.png'));
    });

