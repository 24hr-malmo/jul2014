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

            var svg = '<svg><g class="ornament">\n<circle fill="#D7000A" cx="' + ornament.x + '" cy="' + ornament.y + '" r="10"></circle>\n</g></svg>';
            var svgRoot = container.querySelector('svg');
            var child = document.createElement('div');
            child.innerHTML = svg;
            var ornamentDom = child.querySelector('svg').firstChild;

            svgRoot.appendChild(ornamentDom);

            setTimeout(function() {
                ornamentDom.classList.add('ornament-active');
            }, 10);

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
