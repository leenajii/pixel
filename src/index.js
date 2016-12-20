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
                if (this.data[idx] === 7 && this.data[idx + 1] === 84 && this.data[idx + 2] === 19) {
                    drawUp(idx, y, x);
                }
                if (this.data[idx] === 139 && this.data[idx + 1] === 57 && this.data[idx + 2] === 137) {
                    this.data[idx] = 255;
                    this.data[idx + 1] = 255;
                    this.data[idx + 2] = 255;
                }
                if (this.data[idx] === 182 && this.data[idx + 1] === 149 && this.data[idx + 2] === 72) {
                    drawRight(idx, y, x);
                }
                if (this.data[idx] === 123 && this.data[idx + 1] === 131 && this.data[idx + 2] === 154) {
                    this.data[idx] = 255;
                    this.data[idx + 1] = 255;
                    this.data[idx + 2] = 255;
                }
            }
        }

        this.pack().pipe(fs.createWriteStream('/home/leena/Pictures/modifiednut.png'));
    });

function drawUp(location, sub_y, sub_x) {
    for (sub_y; sub_y < this.height; sub_y++) {
        var sub_idx = (this.width * sub_y + sub_x) << 2;
        if (this.data[sub_idx] === 51 && this.data[sub_idx + 1] === 69 && this.data[sub_idx + 2] === 169) {
            return;
        } else {
            colorWhite(sub_idx, sub_idx+1, sub_idx+2);
        }
    }
}

function drawRight(location, sub_y, sub_x) {
    for (sub_x; sub_x < this.width; sub_x++) {
        var sub_idx = (this.width * sub_y + sub_x) << 2;
        if (this.data[sub_idx] === 51 && this.data[sub_idx + 1] === 69 && this.data[sub_idx + 2] === 169) {
            return;
        } else {
            colorWhite(sub_idx, sub_idx+1, sub_idx+2);
        }
    }
}

function colorWhite(r, g, b) {
    this.data[r] = 255;
    this.data[g] = 255;
    this.data[b] = 255;
}

/*Ala piirtää ylöspäin, kun pikselin väri on 7, 84, 19.
Ala piirtää vasemmalle, kun pikselin väri on 139, 57, 137.
Lopeta viivan piirtäminen, kun pikselin väri on 51, 69, 169.
Käänny oikealle, kun pikselin väri on 182, 149, 72.
Käänny vasemmalle, kun pikselin väri on 123, 131, 154.*/
