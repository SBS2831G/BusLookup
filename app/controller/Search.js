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

exports.byRego = (req, res) => {
    if (!req.body.rego) {
        res.status(500).json({
            error: 'No rego provided!'
        });
        return;
    }
    Bus.find({
        'registration.number': req.body.rego
    }, (err, buses) => {
        res.render('bus-search-results', {
            buses: buses.map(bus => omit(bus._doc, '_id')).map(bus => {
                bus.cssClass = operatorMap[bus.operator.operator];

                var diff = new Date(bus.busData.deregDate - new Date());
                console.log(bus.registration.prefix + '  ' + (diff.getFullYear() - 1970));

                if (bus.busData.deregDate - new Date() > 0) {
                    bus.timeToDereg = (diff.getFullYear() - 1970) + ' years ' + (diff.getUTCMonth() - 1) + ' months ' + (diff.getUTCDate() - 1) + ' days'
                } else {
                    bus.timeToDereg = -(diff.getFullYear() - 1970 + 1) + ' years ' + (12 - diff.getUTCMonth()) + ' months ' + (31 - diff.getUTCDate()) + ' days ago'
                }
                
                return bus;
            })
        });
    });
};
