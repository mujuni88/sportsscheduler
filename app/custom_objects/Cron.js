'use strict';

var _ = require('lodash');
	
var Cron = (function() {

	var jobs = {

	};

	return {

		getAllJobs: function() {

			return jobs;
		},
		addJob: function(key,value) {

			jobs[key] = value;
		},
		removeJob: function(key) {

			jobs = _.omit(jobs,key);
		}
		
	};
})();

module.exports = Cron;