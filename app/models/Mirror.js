var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MirrorSchema   = new Schema({
    email: {
        type: String
    },
    phone:{
        type:Number
    }
});

module.exports = mongoose.model('Mirror', MirrorSchema);
