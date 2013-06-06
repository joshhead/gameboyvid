(function($) {

    var tsvToObject = function(tsvString) {
        var data = tsvString.split('\n').map(function(row) {
            return row.split('\t');
        });

        // Use column headers as keys to the rest of the rows
        data = data.map(function(row) {
            var obj = {},
                i;

            for (i = 0; i < data[0].length; i++) {
                obj[data[0][i]] = +row[i];
            }

            return obj;
        });

        return data;
    };
    
    var data = tsvToObject($('#pixelData').text());
    window.data = data;

    var lastTick = {
        Sample: 0,
        VSYNC: 0,
        HSYNC: 0,
        CLOCK: 0,
        DATA0: 0,
        DATA1: 0
    };

    var i,
        tick,
        currentFrame = $('<div class="frame">'),
        currentRow = $('<div class="row">');

    currentFrame.append(currentRow);
    $('body').append(currentFrame);

    for (i = 1; i < data.length; i++) {
        tick = data[i];

        if (lastTick.VSYNC === 0 && tick.VSYNC === 1) {
            currentFrame = $('<div class="frame">');
            $('body').append(currentFrame);
        }

        if (lastTick.HSYNC === 0 && tick.HSYNC === 1) {
            currentRow = $('<div class="row">');
            currentFrame.append(currentRow);
        }

        if (lastTick.CLOCK === 1 && tick.CLOCK === 0) {
            (function() {
                var colorClass = 'gray' + ((lastTick.DATA1 * 1) + (lastTick.DATA0 * 2));
                var pixel = $('<div>');
                pixel.addClass('pixel');
                pixel.addClass(colorClass);

                currentRow.append(pixel);
            }());
        }

        lastTick = tick;
    }
}(jQuery));
