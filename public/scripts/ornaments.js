define([ 'socket' ],function(socket) {

    var container;
    
    function init(dom) {
        container = dom;

        //TOTALLY TEMP
        var button = document.querySelector('[data-button-add]');
        if (button) {
            button.addEventListener('click', function() {
                socket.emit('ornament.add');
            }, true);
        }
    }

    function render(ornament, index) {

        index = index || 1;

        setTimeout(function() {

            var svgRoot = container.querySelector('svg');
            var child = document.createElement('div');

            var templateDom = document.querySelector('[data-ornament-type="' + ornament.type + '"]');

            if (templateDom) {
            var html = templateDom.innerHTML.replace(/[\n]/g, '');
            html = html.replace(/x="\w+"/g, 'x="' + ornament.x + '"');
            html = html.replace(/y="\w+"/g, 'y="' + ornament.y + '"');
            child.innerHTML = html;

            var ornamentDom = child.querySelector('svg');

            ornamentDom.classList.add('ornament');
            svgRoot.appendChild(ornamentDom);
            ornamentDom.addEventListener('mouseover', function() {
                console.log(ornament);
            }, false);

            setTimeout(function() {
                ornamentDom.classList.add('ornament-active');
            }, 10);

            }

        }, index * 50);

    }

    function renderList(list) {
        list.forEach(function(ornament, index) {
            render(ornament, index);
        });
    }

    socket.emit('ornaments.load');

    socket.on('ornaments.list', function(data) {
        renderList(data.list);         
    });

    socket.on('ornament.added', function(data) {
        render(data);         
    });


    return {
        init: init
    };

});

// @sourceURL=main.js
