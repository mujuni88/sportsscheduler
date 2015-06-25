'use strict';

var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Group = mongoose.model('Group'),
	EventModel = mongoose.model('Event'),
	Helper = require('../../../../custom_objects/Helper'),
	Sender = require('../../../../custom_objects/Sender'),
	CronJob = require('cron').CronJob,
	Cron = require('../../../../custom_objects/Cron'),
	_ = require('lodash'),
	async = require('async'),
	time = require('time');

var PrivateFunctions = (function() {
	
	var senderCallback = function(user) {

		return function(response) {

			console.log('Email sent successfully to: %s',user.email);
		};
	};

	//get up to date event for cron fires
	var getEvent = function(event,callback) {

		async.waterfall([
			function(done) {
				var query = {
					_id: event._id
				};
				Helper.find(EventModel,query,function(err,mod) {
					//need to figure out what to do here
					if(err)
					{
						console.log('error with event ID %s: %s',event._id,err);
						return false;
					}
					else if(mod.length === 0)
					{
						console.log('The event with ID %s has been deleted since cron was created. Not sending email',event._id);
						return false;
					}
					
					done(null,mod[0]);
				});
			},
			function(event,done) {

				Helper.populate(EventModel,event,function(err,event) { 

					done(null,event);

				});
			}
		],
		callback);
	};

	var createEventMembersQuery = function(event) {
		console.log('event: ' + JSON.stringify(event,null,4));
		var group = event.group;
		var ids = [];

		//gather all member ids for population
		for(var i = 0; i < group.members.length; ++i) {

			ids.push(group.members[i].toString());
		}

		console.log('ids: ' + ids);

		//populate ids
		return {
			_id: 
			{ 
				$in: ids
			}
		};

	};

	return {
		update: 
		{

		},
		create:
		{
			addEventToGroup: function(group,eventID)
			{
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
			createGatherVotesCron: function(event)
			{
				return function(arg1,arg2,done) {
					
					var gatherVotes = function() {

						var query = {
							_id: event._id
						};

						getEvent(event,function(event) {

							console.log('event: ' + JSON.stringify(event,null,4));
							var group = event.group;
							var ids = [];

							console.log('firing gather votes cron for eventID: ' + event._id);
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

								for(var j = 0; j < users.length; ++j)
								{
									var user = users[j];
									console.log('user: ' + JSON.stringify(user,null,4));
									if(user.preferences.receiveTexts)
									{
										var recipient = user.phoneNumber + user.carrier;
										Sender.sendSMS(recipient, 'Event\n', 'Votes Are In!\n' + event.votes.yes.length + ' people voted YES \n' + event.votes.no.length + ' people voted NO \n', senderCallback(user));
									}

									if(user.preferences.receiveEmails)
									{	
										console.log('username%s/email%s: ', user.username,user.email);
										Sender.sendSMS(user.email, 'Event', 'Votes Are In!\n' + event.votes.yes.length + ' people voted YES \n' + event.votes.no.length + ' people voted NO \n', senderCallback(user));
									}
								}
							});
						});
					};

					console.log('event time: ' + event.time);
					console.log('event id: ' + event._id);
					var convertedTime = new time.Date(event.time);
					convertedTime.setTimezone('America/Chicago');

					var settings = {
				  		cronTime: new Date(convertedTime),
				  		onTick: gatherVotes,
				  		start: true,
				  		timeZone: 'America/Chicago'
					};

					var job = new CronJob(settings);

					var cron = {
						key: event._id,
						settings: settings
					};

					Cron.addJob(cron.key,job);

					done(null,arg1,arg2);
				};
			},
			eventStartCron: function(req,event) {

				return function(arg1,arg2,done) {

					var notifyUsersOfEventStart = function() {

						console.log('firing "event voting has started" cron for eventID: ' + event._id);

						var query = {
							_id: event._id
						};

						getEvent(event,function(err,event) {

							query = createEventMembersQuery(event);

							Helper.findWithAllAtts(User,query,function(err,users) {

								for(var i = 0; i < users.length; ++i)
								{
									var user = users[i];
									
									console.log('user: ' + JSON.stringify(user,null,4));
									var eventURL = 'http://'+req.headers.host+'/#!/groups/'+event.group.id+'/events/'+event.id;
									var settingsURL = 'http://'+req.headers.host+'/#!/settings/me/notifications';
									if(user.preferences.receiveTexts)
									{
										var recipient = user.phoneNumber + user.carrier;
										Sender.sendSMS(recipient, 'Event\n', 'Event has started!\nTo vote go to\n' + eventURL + '\n\nTo unsubscribe from notifications go to\n'+settingsURL, senderCallback(user));
									}

									if(user.preferences.receiveEmails)
									{	
										console.log('username%s/email%s: ', user.username,user.email);
										Sender.sendSMS(user.email, 'Event\n', 'Event has started!\nTo vote go to\n' + eventURL + '\n\nTo unsubscribe from notifications go to\n'+settingsURL, senderCallback(user));
									}
								}
							});
						});
					};

					var convertedDate = new time.Date(event.date);
					convertedDate.setTimezone('UTC');
					convertedDate = new Date(convertedDate);
					convertedDate.setSeconds(convertedDate.getSeconds() + 10);

					var settings = {
				  		cronTime: new Date(convertedDate),
				  		onTick: notifyUsersOfEventStart,
				  		start: true
					};

					var job = new CronJob(settings);

					var cron = {
						key: event._id,
						settings: settings
					};

					Cron.addJob(cron.key,job);

					done(null,arg1,arg2);
				};
			}
		}
	};

})();

module.exports = PrivateFunctions;