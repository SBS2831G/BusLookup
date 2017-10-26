const mongoose = require('mongoose'),
    config = require('../config'),
    fs = require('fs'),
    csv = require('csv');

const Bus = require('../app/models/Bus');

const fileTypes = {
    'TIBS': 'TIB',
    'SBST': 'SBS',
    'SG': 'SG',
    'SMRT': 'SMB',
    'PA': 'PA',
    'PC': 'PC',
    'PZ': 'PZ',
    'RU': 'RU',
    'WC': 'WC',
    'CB': 'CB'
};

mongoose.Promise = global.Promise;

function connect() {
	return mongoose.connect('mongodb://' + config.dbUser + ':' + config.dbPass + '@' + config.database + '?authSource=admin', {
        socketTimeoutMS: 600000,
        keepAlive: true,
        reconnectTries: Infinity,
        useMongoClient: true,
        poolSize: 5000000
	});
}

connect().then(() => {
    main();
}).catch(err => {
    console.log(err);
});

function main() {
    Object.keys(fileTypes).forEach(operatorName => {
        console.log('Doing ' + operatorName);
        var regoPrefix = fileTypes[operatorName];

        fs.readFile('./spreadsheets/' + operatorName + '.csv', (err, data) => {
            console.log(data.slice(0, 100))
            csv.parse(data, (err, busList) => {
                busList.splice(0, 1);
                busList.forEach(bus => {
                    if (bus[2] === '') return;
                    bus[8] = bus[8] || '';
                    Bus.findOne({
                        'registration.prefix': regoPrefix,
                        'registration.number': bus[0] * 1
                    }, '-__v', (err, dbbus) => {
                        var busData = {
                            registration: {
                                prefix: regoPrefix,
                                number: bus[0]*1,
                                checksum: bus[1],
                            },
                            busData: {
                                make: bus[2],
                                model: bus[3],

                                bodywork: bus[4],
                                chassis: bus[6],
                                deregDate: bus[7] ? new Date(bus[7]) : new Date(0),
                                gearbox: bus[12],
                                edsModel: bus[13],
                            },
                            operator: {
                                operator: bus[5],
                                depot: bus[9],
                                permService: bus[10]
                            }, fleet: {
                                batch: bus[11],
                            },
                            misc: {
                                chair: bus[14],
                                door: bus[15],
                                aircon: bus[16],
                                notes: bus[8]
                            }
                        }

                        if (bus[8].includes('Layup')) {
                            busData.operator.permService += ' (L)';
                        }

                        if (bus[8].includes('Scrapped')) {
                            if (!busData.operator.permService.includes(' (R)')) {
                                busData.operator.permService += ' (R)';
                            }
                        }

                        if (!dbbus) {
                            // console.log('New Bus: ' + regoPrefix + bus[0] + bus[1]);
                            new Bus(busData).save(() => {
                                // console.log('Saved ' + regoPrefix + bus[0] + bus[1])
                            });
                        } else {
                            // console.log('Updating Bus: ' + regoPrefix + bus[0] + bus[1]);
                            if (busData.operator.permService === '') {
                                busData.operator.permService = dbbus.operator.permService;
                                busData.operator.depot = dbbus.operator.depot;
                            }
                            dbbus.set(busData);
                            dbbus.save(() => {
                                // console.log('Saved ' + regoPrefix + bus[0] + bus[1])
                            });
                        }
                    });
                });
            });
        });
    });
}
