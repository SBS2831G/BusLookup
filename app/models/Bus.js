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
		livery: String,
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
		batch: String,
		ad: {
			type: String,
			default: 'N/A'
		}
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
