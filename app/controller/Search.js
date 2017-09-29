const Bus = require('../models/Bus');

function omit(obj, omitKey) {
  return Object.keys(obj).reduce((result, key) => {
    if(key !== omitKey) {
       result[key] = obj[key];
    }
    return result;
  }, {});
}

var operatorMap = {
    'Go Ahead Singapore': 'gas',
    'SBS Transit': 'sbst',
    'Super Bus Services': 'sbs',
    'Tower Transit Singapore': 'tts',
    'LTA Storage': 'lta',
    'Trans Island Buses': 'tibs',
    'SMRT Buses': 'smrt'
};

var allBusMakes = [];
var allBusModels = [];
var allBodyworks = [];
var allServices = [];
var allDepots = [];
var allGearboxes = [];
var allEDSes = [];
var allOperators = [];

function findAndReturn(req, res, rawJSON) {
    Bus.find(rawJSON, (err, buses) => {
        res.render('bus-search-results', {
            buses: buses.map(bus => omit(bus._doc, '_id')).map(bus => {
                bus.cssClass = operatorMap[bus.operator.operator];

                var diff = new Date(bus.busData.deregDate - new Date());
                if (+bus.busData.deregDate == 0) return bus;
                if (bus.busData.deregDate - new Date() > 0) {
                    bus.timeToDereg = (diff.getFullYear() - 1970) + ' years ' + (diff.getUTCMonth()) + ' months ' + (diff.getUTCDate() - 1) + ' days'
                } else {
                    bus.timeToDereg = (1969 - diff.getFullYear()) + ' years ' + (11 - diff.getUTCMonth()) + ' months ' + (30 - diff.getUTCDate()) + ' days ago'
                    bus.operator.permService += ' (R)';
                }

                return bus;
            }).sort((a, b) => a.registration.number - b.registration.number)
        });
    });
}

function search(req, res, searchPath) {
    if (!req.body.query) {
        res.status(400).json({
            error: 'No query provided!'
        });
        return;
    }
    findAndReturn(req, res, JSON.parse(`{"${searchPath}": "${req.body.query}"}`));
}

exports.byRego = (req, res) => {
    search(req, res, 'registration.number');
};

exports.byService = (req, res) => {
    if (!req.body.query) {
        res.status(400).json({
            error: 'No query provided!'
        });
        return;
    }

    if (!!req.body.query.match(/^\d{1,3}\w?$/)) {
        search(req, res, 'operator.permService');
    } else if (!!req.body.query.match(/^\w{4,5}$/)) {
        search(req, res, 'operator.depot');
    } else if (!!req.body.query.match(/^\w{4,5} \d{1,3}\w?$/)) {
        var x = req.body.query.match(/(\w{4,5}) (\d{1,3}\w?)/);
        findAndReturn(req, res, {
            'operator.depot': x[1],
            'operator.permService': x[2]
        });
    }
}

Bus.distinct('busData.make', (err, makes) => {
    allBusMakes = makes;
});

Bus.distinct('busData.model', (err, models) => {
    allBusModels = models;
});

Bus.distinct('busData.bodywork', (err, bodyworks) => {
    allBodyworks = bodyworks;
});

Bus.distinct('operator.depot', (err, depots) => {
    allDepots = depots;
});

Bus.distinct('operator.permService', (err, services) => {
    allServices = services.filter(e => !!e.match(/\d+/)).sort((a, b) => b.match(/\d+/)[0] - a.match(/\d+/)[0]);
});

Bus.distinct('operator.operator', (err, operators) => {
    allOperators = operators;
});

Bus.distinct('busData.gearbox', (err, gearboxes) => {
    allGearboxes = gearboxes;
});

Bus.distinct('busData.edsModel', (err, edses) => {
    allEDSes = edses;
});


exports.smartSearch = (req, res) => {
    if (!req.body.query) {
        res.status(400).json({
            error: 'No query provided!'
        });
        return;
    }

    var tokens = ' ' + req.body.query.replace(/\s{2,}/, ' ').trim() + ' ';
    var search = {};

    allBusMakes.forEach(make => {
        if (tokens.includes(' ' + make + ' ')) {
            search['busData.make'] = make;
            tokens = tokens.replace(make, ' ');
        }
    });
    allBusModels.forEach(model => {
        if (tokens.includes(' ' + model + ' ')) {
            search['busData.model'] = model;
            tokens = tokens.replace(model, ' ');
        }
    });

    allBodyworks.forEach(bodywork => {
        if (tokens.includes(' ' + bodywork + ' ')) {
            search['busData.bodywork'] = bodywork;
            tokens = tokens.replace(bodywork, ' ');
        }
    });

    allGearboxes.forEach(gearbox => {
        if (gearbox === '') return;
        if (tokens.includes(' ' + gearbox + ' ')) {
            search['busData.gearbox'] = gearbox;
            tokens = tokens.replace(gearbox, ' ');
        }
    });

    allEDSes.forEach(eds => {
        if (tokens.includes(' ' + eds + ' ')) {
            search['busData.edsModel'] = eds;
            tokens = tokens.replace(eds, ' ');
        }
    });

    allOperators.forEach(operator => {
        if (operator === '') return;
        if (tokens.includes(' ' + operator + ' ')) {
            search['operator.operator'] = operator;
            tokens = tokens.replace(operator, ' ');
        }
    });

    allDepots.forEach(depot => {
        if (depot === '') return;
        if (tokens.includes(' ' + depot + ' ')) {
            search['operator.depot'] = depot;
            tokens = tokens.replace(depot, ' ');
        }
    });

    allServices.forEach(service => {
        if (service === '') return;
        if (tokens.includes(' ' + service + ' ')) {
            search['operator.permService'] = service;
            tokens = tokens.replace(service, ' ');
        }
    });


    if (Object.keys(search).length === 0) {
        res.render('bus-search-results', {
            buses: []
        });
        return;
    }

    findAndReturn(req, res, search);

}
