define([ 'socket' ],function(socket) {

    var container;
    var bubbleActive = false;
    
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

    function showBubble(ornament) {
        bubbleDom.querySelector('[data-name]').innerHTML = ornament.name;
        bubbleDom.classList.add('modifier-active');
        bubbleActive = true;
    }

    function hideBubble() {
        bubbleDom.classList.remove('modifier-active');
        bubbleActive = false;

    }


    var bubbleDom = document.querySelector('[data-bubble]');

    document.addEventListener('mousemove', function(e) {

        var delta = 10;
        bubbleDom.style.top = (e.pageY + delta) + 'px';
        bubbleDom.style.left = (e.pageX + delta) + 'px';

    }, false);


    function render(ornament, index) {

        index = index || 1;

        // add to thank you list
        var listRoot = document.querySelector('[data-thank-you-list]');
        var liDom = document.createElement('li');
        liDom.innerHTML = ornament.name;
        listRoot.appendChild(liDom);

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
                    showBubble(ornament);
                }, false);

                ornamentDom.addEventListener('mouseleave', function() {
                    hideBubble();
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
