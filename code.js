'use strict';

var 表格;

function 弹出表格(事件) {
    表格.省 = 事件.currentTarget.省;
    表格.getElementsByTagName('th')[0].textContent = 表格.省.名;
    表格.style.display = 'table';
    表格.style.left = 事件.clientX + 'px';
    表格.style.top = 事件.clientY + 'px';
    事件.stopPropagation();
}

function 处理选择(事件) {
    var 选择 = +事件.currentTarget.getAttribute('data-level');
    表格.省.等级 = 选择;
    表格.省.图形.attr({fill : colors[选择]});
    document.getElementById('等级').textContent = 计算();
    表格.style.display = 'none';
}


function 计算() {
    var 总计 = 0;
    for (var 省名 in 中国) {
        总计 += 中国[省名].等级;
    }
    return 总计;
}

window.onload = function () {
    表格 = document.getElementById('表格');
    var 地图 = new Raphael('地图');
    for (var 省名 in 中国) {
        var 省 = 中国[省名];
        var 图形 = 地图.path(省.路径);
        图形.attr({fill : colors[0]});
        省.名 = 省名;
        省.图形 = 图形;
        省.等级 = 0;

        var x = 图形.getBBox().x + 图形.getBBox().width / 2 + 省.偏移.x;
        var y = 图形.getBBox().y + 图形.getBBox().height / 2 + 省.偏移.y;
        var 文字 = 地图.text(x, y, 省名);


        [图形, 文字].forEach(
            function (元素) {
                元素.attr({cursor : 'pointer'});
                元素[0].onclick = 弹出表格;
                元素[0].省 = 省;
            }
        );
    }

    Array.from(document.getElementsByClassName('选择')).forEach(
        function (选择) {
            选择.style.backgroundColor = colors[选择.getAttribute('data-level')];
            选择.onclick = 处理选择;
        }
    );

    document.getElementsByTagName('html')[0].onclick = function () {
        表格.style.display = 'none';
    };

    document.getElementById('产生图片').onclick = function () {
        html2canvas(document.getElementById('地图')).then(
            function (画布) {
                var link = document.createElement('a');
                link.download = '制县等级.png';
                link.href = 画布.toDataURL();
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        )
    };

    document.getElementById('脸书').href = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURI(window.location.href);
};
