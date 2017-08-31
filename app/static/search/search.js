function loadBuses() {
    $.ajax({
        url: '/search/byRego',
        method: 'POST',
        data: {
            rego: $('#regoInput').value
        }
    }, response => {
        if (response.error) {
            response = '';
        }
        $('#results').innerHTML = response;
    });
}

function load() {
    var timer = 0;

    $('#regoInput').on('input', () => {
        clearTimeout(timer);
        timer = setTimeout(loadBuses, 750);
    });
}

load();
