var searchFunctions = {
    0: 'byRego',
    1: 'byService',
    2: 'byModel'
}

function loadBuses() {
    $.ajax({
        url: '/search/' + searchFunctions[$('select').selectedIndex],
        method: 'POST',
        data: {
            rego: $('#input').value
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

    $('#input').on('input', () => {
        clearTimeout(timer);
        timer = setTimeout(loadBuses, 750);
    });

    $('select').on('change', () => {
        var index = $('select').selectedIndex;
        switch(index) {
            case 0:
                $('#input').type = 'number';
                break;
            case 1:
            case 2:
                $('#input').type = 'text';
                break;
        }
        $('#input').value = '';
    });
}

load();
