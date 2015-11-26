'use strict';

var _ = require('lodash'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	EventModel = mongoose.model('Event'),
	Cron = mongoose.model('Cron'),
	CronJob = require('cron').CronJob,
	Helper = require('./Helper'),
	config = require('../../config/config'),
	Sender = require('./Sender');

var CronFunctions = (function() {

	var sendTemplate = function(user) {
		
		return function(err,templateHTML) {
        
        	Sender.sendSMS(user.email, 'Sports Scheduler', templateHTML, Sender.senderCallback(user));

    	};
    };

	return {

		gatherAttendance: function(res,eventID) {

			return function() {

				var senderCallback = function(user) {

					return function(response) {

						console.log('Email sent successfully to: %s',user.email);
					};
				};

				Helper.getPopulatedObjectByID(EventModel,eventID,function(err,event) {

					var group = event.group;
					var ids = [];

					console.log('firing gather attendance cron for eventID: ' + event.id);
					//gather all member ids for population
					for(var i = 0; i < group.members.length; ++i) {

						ids.push(group.members[i].toString());
					}

					console.log('ids: ' + ids);

					//populate ids
					var query = {

						_id: 
						{ 
							$in: ids
						}

					};

					Helper.findWithAllAtts(User,query,function(err,users) {

						for(var j = 0; j < users.length; ++j) {

							var user = users[j];
							
							if(user.preferences.receiveTexts) {

								var recipient = user.phoneNumber + user.carrier;
								Sender.sendSMS(recipient, 'Event\n', 'Attendance Results!\n' + event.attendance.yes.length + ' YES \n' + event.attendance.no.length + ' NO \n', senderCallback(user));
							}

							if(user.preferences.receiveEmails) {

								res.render('templates/attendance-email', {
									eventName: event.name,
									groupName: event.group.name,
									yesUsers: event.attendance.yes,
									noUsers: event.attendance.no,
									appName: config.app.title,
									devEmail: config.app.devEmail
									
								}, sendTemplate(user));
								//Sender.sendSMS(user.email, 'Event\n', 'Attendance Results!\n' + event.attendance.yes.length + ' YES \n' + event.attendance.no.length + ' NO \n', senderCallback(user));
							}

							var	CronHandler = require('./CronHandler');
							CronHandler.removeCron(eventID);
						}
					});
				});
			};
		}
	};
})();

module.exports = CronFunctions;