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

function findAndReturn(req, res, rawJSON) {
    Bus.find(rawJSON, (err, buses) => {
        res.render('bus-search-results', {
            buses: buses.map(bus => omit(bus._doc, '_id')).map(bus => {
                bus.cssClass = operatorMap[bus.operator.operator];

                var diff = new Date(bus.busData.deregDate - new Date());
                if (+bus.busData.deregDate === 0) return bus;
                if (bus.busData.deregDate - new Date() > 0) {
                    bus.timeToDereg = (diff.getFullYear() - 1970) + ' years ' + (diff.getUTCMonth()) + ' months ' + (diff.getUTCDate()) + ' days'
                } else {
                    bus.timeToDereg = (1969 - diff.getFullYear()) + ' years ' + (11 - diff.getUTCMonth()) + ' months ' + (31 - diff.getUTCDate()) + ' days ago'
                    if (!bus.operator.permService.includes('(R)'))
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
