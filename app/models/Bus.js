const mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var BusSchema = new Schema({
	registration: {
		prefix: String,
		number: Number,
		checksum: String
	},
	busData: {
		make: String,
		model: String,
		bodywork: String,
		chassis: String,
		deregDate: {
			type: Date,
			default: new Date(0)
		},
		gearbox: String,
		edsModel: String
	},
	operator: {
		operator: String,
		depot: String,
		permService: String
	},
	fleet: {
		batch: String
	},
	misc: {
		chair: String,
		door: String,
		aircon: String,
		notes: String
	}
});

var Bus = mongoose.model('Buse', BusSchema); // [sic]

module.exports = Bus;
