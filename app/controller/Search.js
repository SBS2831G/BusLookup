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

function search(req, res, searchPath) {
    if (!req.body.query) {
        res.status(500).json({
            error: 'No rego provided!'
        });
        return;
    }
    Bus.find({
        searchPath: req.body.query
    }, (err, buses) => {
        res.render('bus-search-results', {
            buses: buses.map(bus => omit(bus._doc, '_id')).map(bus => {
                bus.cssClass = operatorMap[bus.operator.operator];

                var diff = new Date(bus.busData.deregDate - new Date());

                if (bus.busData.deregDate - new Date() > 0) {
                    bus.timeToDereg = (diff.getFullYear() - 1970) + ' years ' + (diff.getUTCMonth()) + ' months ' + (diff.getUTCDate() - 1) + ' days'
                } else {
                    bus.timeToDereg = (1969 - diff.getFullYear()) + ' years ' + (11 - diff.getUTCMonth()) + ' months ' + (30 - diff.getUTCDate()) + ' days ago'
                    bus.operator.permService += ' (R)';
                }

                return bus;
            })
        });
    });
}

exports.byRego = (req, res) => {
    search(req, res, 'registration.number');
};

exports.byService = (req, res) => {
    search(req, res, 'operator.permService');
}
