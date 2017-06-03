var mongoose = require('mongoose'),
	shareDataSchema = require('../schemas/shareData'),
	ShareData = mongoose.model('shareData', shareDataSchema);

module.exports = ShareData;