'use strict';

var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Group = mongoose.model('Group'),
	EventModel = mongoose.model('Event'),
	Helper = require('../../../../custom_objects/Helper'),
	Sender = require('../../../../custom_objects/Sender'),
	config = require('../../../../../config/config'),
	CronJob = require('cron').CronJob,
	CronHandler = require('../../../../custom_objects/CronHandler'),
	CronFunctions = require('../../../../custom_objects/CronFunctions'),
	_ = require('lodash'),
	async = require('async'),
	time = require('time'),
	dateFormat = require('dateformat'),
	GoogleUrlShortener = require('../../../../custom_objects/GoogleUrlShortener');


var PrivateFunctions = (function() {
	
	var senderCallback = function(user) {

		return function(response) {

			console.log('Email sent successfully to: %s',user.email);
		};
	};

	var sendTemplate = function(user) {
		
		return function(err,templateHTML) {

			Sender.sendSMS(user.email, 'Sports Scheduler', templateHTML, senderCallback(user));
		};
	};

	var createEventMembersQuery = function(event) {

		var group = event.group;
		var ids = [];

		//gather all member ids for population
		for(var i = 0; i < group.members.length; ++i) {

			ids.push(group.members[i].toString());
		}

		//populate ids
		return {

			_id: 
			{ 
				$in: ids
			}
		};

	};

	return {

		create:
		{
			addEventToGroup: function(group,eventID) {

				return function(arg1,arg2,done) {

					group.events.push(eventID);
					
					group.save(function(err) {

						if (err) {

							err = {

								model: Group.title,
								err: err

							};

							console.log('error: ' + err);
							done(err,null,1);
						}
						else {

							console.log('saved successfully');
							done(null,group,arg2);
						}
					});
				};
			},
			createGatherAttendanceCron: function(res,event) {

				return function(arg1,arg2,done) {
					
					console.log('event time: ' + event.time);
					console.log('attndCloseTime: ' + event.attndCloseTime);
					console.log('event id: ' + event.id);
					event.attndCloseTime.setTimezone('America/Chicago');
					var cronTime = new Date(event.attndCloseTime);

					var settings = {

				  		cronTime: cronTime,
				  		onTick: CronFunctions.gatherAttendance(res,event.id),
				  		start: true,
				  		timeZone: 'America/Chicago'

					};

					var job = new CronJob(settings);

					var cron = {

						eventID: event.id,
						timeZone: settings.timeZone,
						cronTime: cronTime,
						onTick: 'gatherAttendance'
					};

					CronHandler.addJob(cron);

					done(null,arg1,arg2);
				};
			},
			eventStartNotifications: function(req,res,event) {

				return function(arg1,arg2,done) {

					var query = {

						_id: event.id

					};

					Helper.getPopulatedObjectByID(EventModel,event.id,function(err,event) {

						query = createEventMembersQuery(event);

						Helper.findWithAllAtts(User,query,function(err,users) {

							var eventURL = 'http://'+req.headers.host+'/#!/groups/'+event.group.id+'/events/'+event.id;
							var settingsURL = 'http://'+req.headers.host+'/#!/settings/me/notifications';

							async.waterfall([
								function(callback){
									GoogleUrlShortener.shorten(eventURL, function(err, response){
										eventURL = (err) ? eventURL : response.id;
										callback(null, eventURL);
									});
								},
								function(eventUrl, callback){
									GoogleUrlShortener.shorten(settingsURL, function(err, response){
										settingsURL = (err) ? settingsURL : response.id;
										callback(null, eventUrl, settingsURL);
									});
								}
							], function(err, eventUrl, settingsUrl){
								console.log("Event URL: %s and Settings URL: %s", eventUrl, settingsUrl);
								for(var i = 0; i < users.length; ++i) {

									var user = users[i];

									var eventEndDate = new Date(event.time);
									eventEndDate = dateFormat(eventEndDate, 'dddd mmmm dS h:MM TT');

									if(user.preferences.receiveTexts) {

										var recipient = user.phoneNumber + user.carrier;
										Sender.sendSMS(recipient, 'Sports Scheduler', 'Event for Group: '+event.group.name+' has started!\nLet everyone know your plans "at": ' + eventUrl + '\nAttendance Ends: ' + eventEndDate + '\nUnsubscribe from notifications: '+settingsUrl, senderCallback(user));
									}

									if(user.preferences.receiveEmails) {

										res.render('templates/create-event-email', {
											user: user,
											event: event,
											eventURL: eventURL,
											groupURL: req.headers.origin + '/#!/groups/' + event.group.id,
											startTime: eventEndDate,
											attndTime: dateFormat(new Date(event.attndCloseTime), 'dddd mmmm dS h:MM TT'),
											appName: config.app.title,
											devEmail: config.app.devEmail
											
										}, sendTemplate(user));

										//Sender.sendSMS(user.email, 'Sports Scheduler\n', 'Event for Group: '+event.group.name+' has started!\nLet everyone know your plans "at":\n' + eventUrl + '\n\nAttendance Ends: ' + eventEndDate + '\nTo unsubscribe from notifications go to\n'+settingsUrl, senderCallback(user));
									}
								}

								done(null,arg1,arg2);
							});
							
						});
					});					
				};
			}
		},
		update: 
		{

		},
		delete: 
		{
			notifiyUsersOfEventCancellation: function(res,event) {

				return function(arg1,arg2,done) {

					//remove from cron
					CronHandler.removeCron(event.id);
					
					//if event time has passed, don't send notifications
					var now = new Date().getTime();
					if(event.time.getTime() < now)
					{
						done(null,arg1,arg2);
						return;
					}

					var query = {

						_id: event.id

					};

					Helper.populate(EventModel,event,function(err,event) {
						
						query = createEventMembersQuery(event);

						Helper.findWithAllAtts(User,query,function(err,users) {

							for(var i = 0; i < users.length; ++i) {

								var user = users[i];
																
								if(user.preferences.receiveTexts) {

									var recipient = user.phoneNumber + user.carrier;
									Sender.sendSMS(recipient, 'Sports Scheduler', 'Event: ' + event.name + ' for Group: '+event.group.name+' has been canceled', senderCallback(user));
								}

								if(user.preferences.receiveEmails) {
									
									res.render('templates/delete-event-email', {
										eventName: event.name,
										groupName: event.group.name,
										appName: config.app.title,
										devEmail: config.app.devEmail
										
									}, sendTemplate(user));
									//Sender.sendSMS(user.email, 'Sports Scheduler', 'Event: ' + event.name + ' for Group: '+event.group.name+' has been canceled', senderCallback(user));
								}
							}

							done(null,arg1,arg2);
						});
					});
				};
			}
		},
	};

})();

module.exports = PrivateFunctions;
