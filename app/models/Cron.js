'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	serverJSON = require('../local_files/ui/server.ui.json');

var CronSchema   = new Schema({
    
    eventID: {
        
        type: Schema.ObjectId,
        required: 'eventID.empty'
    },
    onTick: {

    	type: String,
    	required: 'key.empty'

    },
    timeZone: {
    	
    	type: String,
    	default: 'America/Chicago'

    },
    cronTime: {
    	
    	type: Date,
    	required: 'cronTime.empty'

    }
});

CronSchema.statics.functionsArray = [
	
];

CronSchema.statics.objectIDAtts = [
	{
		name: 'eventID',
		model: 'Event'
	}
];

CronSchema.statics.title = serverJSON.constants.crons;
CronSchema.statics.errPath = 'api.events';
CronSchema.statics.attsToShow = ['_id', 'cronTime', 'onTick', 'timeZone', 'eventID'];

mongoose.model('Cron', CronSchema);
