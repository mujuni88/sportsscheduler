'use strict';

var _ = require('lodash'),
	mongoose = require('mongoose'),
	EventModel = mongoose.model('Event'),
	Cron = mongoose.model('Cron'),
	CronJob = require('cron').CronJob,
	Helper = require('./Helper'),
	CronFunctions = require('./CronFunctions');
	
var CronHandler = (function() {

	var jobs = {

	};

	return {

		getAllJobs: function() {

			return jobs;
		},
		addJob: function(cron) {

			cron = new Cron(cron);

			cron.save(function(err) {

				if(err)
					console.log('failure to add cron for event: ' + cron.eventID);
			});
		},
		removeCron: function(eventID) {

			//jobs = _.omit(jobs,key);
			CronHandler.restartCrons();
			var query = {
				eventID: new mongoose.Types.ObjectId(eventID)
			};

			Cron.find(eventID).remove().exec();
		},
		restartCrons: function() {

			Helper.find(Cron,{},function(err,crons) {

				for(var i = 0; i < crons.length; ++i) {

					var cron = crons[i];
					var now = new Date().getTime();

					//delete cron if the cronTime is behind the current time of restart
					if(cron.cronTime.getTime() < now) {

						CronHandler.removeCron(cron.eventID);

					}

					var settings = {

				  		cronTime: cron.cronTime,
				  		onTick: CronFunctions[cron.onTick](cron.eventID.toString()),
				  		start: true,
				  		timeZone: 'America/Chicago'

					};

					console.log('restarted cron for onTick: ' + cron.onTick + ' at time: ' + cron.cronTime);
					var job = new CronJob(settings);
				}
			});
		}
	};
})();

module.exports = CronHandler;