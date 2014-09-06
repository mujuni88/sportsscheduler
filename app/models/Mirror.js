var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MirrorSchema   = new Schema({
	json: String
});

module.exports = mongoose.model('Mirror', MirrorSchema);
