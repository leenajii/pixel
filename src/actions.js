var left = {"r": 123, "g": 131, "b": 154, "a": 255},
    right = {"r": 182, "g": 149, "b": 72, "a": 255},
    drawUp = {"r": 7, "g": 84, "b": 19, "a": 255},
    drawLeft = {"r": 139, "g": 57, "b": 137, "a": 255},
    stop = {"r": 51, "g": 69, "b": 169, "a": 255};

module.exports = {
    turnLeft: function (rgb) {
        return JSON.stringify(left) === JSON.stringify(rgb);
    },
    turnRight: function (rgb) {
        return JSON.stringify(right) === JSON.stringify(rgb);
    },
    drawUp: function (rgb) {
        return JSON.stringify(drawUp) === JSON.stringify(rgb);
    },
    drawLeft: function (rgb) {
        return JSON.stringify(drawLeft) === JSON.stringify(rgb);
    },
    stop: function (rgb) {
        return JSON.stringify(stop) === JSON.stringify(rgb);
    }
}


