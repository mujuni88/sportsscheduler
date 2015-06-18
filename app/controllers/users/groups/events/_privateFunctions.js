'use strict';

var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Group = mongoose.model('Group'),
	EventModel = mongoose.model('Event'),
	Helper = require('../../../../custom_objects/Helper'),
	Sender = require('../../../../custom_objects/Sender'),
	CronJob = require('cron').CronJob,
	Cron = require('../../../../custom_objects/Cron'),
	_ = require('lodash');

var PrivateFunctions = (function() {
	
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

					var callback = function(user) {

						return function(response) {

							console.log('Email sent successfully to: %s',user.email);
						};
					};
					
					var gatherVotes = function() {

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
							else
							{
								event = mod[0];
								Helper.populate(EventModel,event,function(err,event) {

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
												Sender.sendSMS(recipient, 'Event\n', 'Votes Are In!\n' + event.votes.yes.length + ' people voted YES \n' + event.votes.no.length + ' people voted NO \n', callback(user));
											}

											if(user.preferences.receiveEmails)
											{	
												console.log('username%s/email%s: ', user.username,user.email);
												Sender.sendSMS(user.email, 'Event', 'Votes Are In!\n' + event.votes.yes.length + ' people voted YES \n' + event.votes.no.length + ' people voted NO \n', callback(user));
											}
										}
									});
								});
							}
						});
					};

					var time = require('time');
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
			}
		}
	};

})();

module.exports = PrivateFunctions;