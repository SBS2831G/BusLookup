const mongoose = require('mongoose'),
    config = require('../config'),
    request = require('request'),
    {JSDOM} = require('jsdom');

const Bus = require('../app/models/Bus');

var urls = [
        'https://sgwiki.com/wiki/Volvo_B9TL_(CDGE)',
        'https://sgwiki.com/wiki/Volvo_B9TL_(Wright_Eclipse_Gemini_2)_(Batch_1)',
        'https://sgwiki.com/wiki/Volvo_B9TL_(Wright_Eclipse_Gemini_2)_(Batch_2)',
        'https://sgwiki.com/wiki/Volvo_B9TL_(Wright_Eclipse_Gemini_2)_(Batch_3)',
        'https://sgwiki.com/wiki/Volvo_B9TL_(Wright_Eclipse_Gemini_2)_(Batch_4)',
        'https://sgwiki.com/wiki/Volvo_B10TL',
        'https://sgwiki.com/wiki/Volvo_B10BLE',
        'https://sgwiki.com/wiki/Dennis_Trident',
        'https://sgwiki.com/wiki/Volvo_B10M_Mark_IV_(DM3500)',
        'https://sgwiki.com/wiki/Volvo_Olympian_3-Axle_(Batch_3)',
        'https://sgwiki.com/wiki/Mercedes-Benz_O530_Citaro',
        'https://sgwiki.com/wiki/Mercedes-Benz_O530_Citaro_(Batch_1)',
        'https://sgwiki.com/wiki/Mercedes-Benz_O530_Citaro_(Batch_2)',
        'https://sgwiki.com/wiki/Mercedes-Benz_O530_Citaro_(Batch_3)',
        'https://sgwiki.com/wiki/MAN_NL323F_(Batch_1)',
        'https://sgwiki.com/wiki/MAN_NL323F_(Batch_2)',
        'https://sgwiki.com/wiki/MAN_NL323F_(Batch_3)',
        'https://sgwiki.com/wiki/MAN_NL323F_(3-Door)',
        'https://sgwiki.com/wiki/MAN_ND323F_(Batch_1)',
        'https://sgwiki.com/wiki/MAN_ND323F_(Batch_2)',
        'https://sgwiki.com/wiki/MAN_ND323F_(Batch_3)',
        'https://sgwiki.com/wiki/Scania_K230UB_(Batch_1_Euro_IV)',
        'https://sgwiki.com/wiki/Scania_K230UB_(Batch_2_Euro_IV)',
        'https://sgwiki.com/wiki/Scania_K230UB_(Batch_1_Euro_V)',
        'https://sgwiki.com/wiki/Scania_K230UB_(Batch_2_Euro_V)',
        'https://sgwiki.com/wiki/Alexander_Dennis_Enviro500',
        'https://sgwiki.com/wiki/MAN_NG363F',
        'https://sgwiki.com/wiki/Mercedes-Benz_OC500LE',
        'https://sgwiki.com/wiki/Mercedes-Benz_O405G_(Hispano_Habit)',
        'https://sgwiki.com/wiki/Mercedes-Benz_O405G_(Volgren)'
];

mongoose.Promise = global.Promise;

function connect() {
	return mongoose.connect('mongodb://' + config.dbUser + ':' + config.dbPass + '@' + config.database + '?authSource=admin', {
        socketTimeoutMS: 600000,
        keepAlive: true,
        reconnectTries: Infinity,
        useMongoClient: true,
        poolSize: 50000
	});
}

connect().then(() => {
    main();
}).catch(err => {
    console.log(err);
});

function main() {
    urls.forEach(url => {
        request(url, (err, res, body) => {
            var dom = new JSDOM(body);
            var tables = Array.from(dom.window.document.querySelectorAll('table.toccolours'));
            tables.forEach(table => {

                var buses = Array.from(table.querySelectorAll('tr')).slice(1)

                buses.forEach(bus => {
                    var rego = bus.children[0].textContent.trim().match(/([A-Z]+)(\d+)(\w)/).slice(1, 4);
                    var deployment = bus.children[1].textContent.trim().split(' ').concat(['Unknown']);

                    var search = {
                        'registration.prefix': rego[0],
                        'registration.number': rego[1] * 1,
                        'registration.checksum': rego[2]
                    }
                    bus[4] = bus[4] || 'Unknown';
                    console.log('Updating ' + rego[0] + rego[1] + rego[2]);

                    var update = {
                        $set: {
                            'operator.depot': deployment[0],
                            'operator.permService': deployment[1].split('/')[0],
                            'operator.crossOvers': deployment[1].split('/').slice(1).map(svc => svc.replace('*', ''))
                        }
                    }

                    Bus.findOneAndUpdate(search, update, () => {
                        console.log('Updated ' + rego[0] + rego[1] + rego[2]);
                    });
                });
            });
        });
    });
}
