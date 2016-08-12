//function to keep everything in local scope
(function() {

    var templates = document.querySelectorAll('script[type="text/handlebars"]');

    Handlebars.templates = Handlebars.templates || {};

    Array.prototype.slice.call(templates).forEach(function(script) {
        Handlebars.templates[script.id] = Handlebars.compile(script.innerHTML);
    });

    var button = $('button');
    var nameField = $('#inputField');
    var typeField = $('select');
    var body = $('body');
    var container = $('#container');
    var res = $('#res');
    var name;
    var type;
    var bodyHeight = '';
    var windowHeight = '';
    var bodyscrollTop = '';
    var timer;
    var next;

    button.on('click', function searchFor() {
        name = encodeURIComponent(nameField.val());
        type = typeField.val();
        getRecords();
        container.empty();
    });

    function getRecords(url) {
        if (!url) {
            url = 'https://api.spotify.com/v1/search?q='+ name +'&type=' + type;
        }
        $.get(url, function(data) {
            data = data[type + 's'];
            var rec = data.items;
            next = data.next;
            $('#more').remove();
            if (!rec || !rec.length) {
                res.html('No results');
                return;
            }
            var records = [];
            res.html('Results for ' + '"' + name + '"');
            for (var item in rec) {
                var images = rec[item].images;
                var img = images[0];
                if (!img) {
                    img = {
                        url: 'kit1.jpg'
                    }
                }
                records.push({
                    image: img.url,
                    name: rec[item].name
                })
            }
            container.append(Handlebars.templates.tick({
                records: records
            }))
            timer = setTimeout(scro, 2000);
            //$('<button id="more">more</button>').on('click', function () {
            //    get(next);
            //}).appendTo(container);
        })
    }

    function scro() {
        bodyHeight = $(document).height();
        windowHeight = $(window).height();
        bodyscrollTop = $('body').scrollTop();
        if (bodyscrollTop > bodyHeight - windowHeight - 200) {
            getRecords(next);
        }
        setTimeout(scro, 2000);
    };
})();
