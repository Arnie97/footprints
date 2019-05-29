'use strict';

var score = 0;

function levelCycle(event) {
    var region = event.currentTarget.region;
    var new_level = (region.level + 1) % (levels.length - 1);
    document.getElementById('level-' + region.level).textContent--;
    document.getElementById('level-' + new_level).textContent++;
    document.getElementById('total').textContent -= region.level - new_level;
    region.level = new_level;
    region.path.attr({fill: levels[new_level].color});
}

window.onload = function() {
    var map = new Raphael('map');
    for (var name in regions) {
        var region = regions[name];
        region.level = 0;

        var path = region.path = map.path(region.path);
        path.attr({fill: levels[0].color});

        var x = path.getBBox().x + path.getBBox().width / 2;
        var y = path.getBBox().y + path.getBBox().height / 2;
        if (region.label_offset) {
            x += region.label_offset[0];
            y += region.label_offset[1];
        }
        var label = map.text(x, y, name);

        [path, label].forEach(function (e) {
            e.attr({cursor : 'pointer'});
            e[0].onclick = levelCycle;
            e[0].region = region;
        });
    }

    var legend = document.createElement('tbody');
    document.getElementById('legend').appendChild(legend);
    levels.forEach(function(level, level_no) {
        var legend_item = document.createElement('tr');
        legend_item.style.backgroundColor = level.color;

        var label = document.createElement('td');
        label.textContent = level.total? 'Σ': level_no;
        legend_item.appendChild(label);

        label = document.createElement('td');
        label.textContent = level.description;
        legend_item.appendChild(label);

        label = document.createElement('td');
        label.textContent = level_no? 0: Object.keys(regions).length;
        label.id = level.total? 'total': 'level-' + level_no;
        legend_item.appendChild(label);

        legend.appendChild(legend_item);
    });

    document.getElementById('export').onclick = function() {
        html2canvas(document.getElementById('map')).then(function(canvas) {
            var link = document.createElement('a');
            link.download = '制县等级.png';
            link.href = canvas.toDataURL();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    };
};
