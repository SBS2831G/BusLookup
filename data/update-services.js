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
        'https://sgwiki.com/wiki/MAN_NL323F_(2-Door_Batch_1)',
        'https://sgwiki.com/wiki/MAN_NL323F_(2-Door_Batch_2)',
        'https://sgwiki.com/wiki/MAN_NL323F_(2-Door_Batch_3)',
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
                var text = table.textContent.replace(/\n/g, '');
                var possibleMatches = text.match(/((?:SG|SBS|SMB|TIB)\d{1,4}\w)(\w{4,5})\s?(SP|TRG|\d{1,3}[eAB]?)?/g).map(bus=>bus.match(/([A-Z]{2,3})(\d{1,4})(\w)(\w{4,5})\s(\w+)?/));
                var matches = possibleMatches.filter(Boolean);
                var output = matches.map(bus => bus.slice(1,6));
                output.forEach(bus => {
                    var search = {
                        'registration.prefix': bus[0],
                        'registration.number': bus[1] * 1,
                        'registration.checksum': bus[2]
                    }
                    bus[4] = bus[4] || 'Unknown';
                    var update = {
                        $set: {
                            'operator.depot': bus[3],
                            'operator.permService': bus[4].split('/')[0],
                            'operator.crossOvers': bus[4].split('/').slice(1).map(svc => svc.replace('*', ''))
                        }
                    }

                    console.log('Updating ' + bus[0] + bus[1] + bus[2]);
                    Bus.findOneAndUpdate(search, update, () => {
                        console.log('Updated ' + bus[0] + bus[1] + bus[2]);
                    });
                });
            });
        });
    });
}
