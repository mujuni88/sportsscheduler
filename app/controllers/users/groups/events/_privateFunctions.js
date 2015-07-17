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
	time = require('time'),
	dateFormat = require('dateformat');

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

					_id: event.id

				};

				Helper.findOne(EventModel,query,function(err,updatedEvent) {
					//need to figure out what to do here
					if(err)	{

						console.log('error with event ID %s: %s',event.id,err);
						return false;
					}
					else if(!updatedEvent) {

						console.log('The event with ID %s has been deleted since cron was created. Not sending email',event.id);
						return false;
					}
					
					done(null,updatedEvent);
				});
			},
			function(updatedEvent,done) {

				Helper.populate(EventModel,updatedEvent,function(err,updatedEvent) { 

					done(null,updatedEvent);

				});
			}
		],
		callback);
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
			createGatherVotesCron: function(event) {

				return function(arg1,arg2,done) {
					
					var gatherVotes = function() {

						var query = {

							_id: event.id

						};

						getEvent(event,function(err,event) {

							var group = event.group;
							var ids = [];

							console.log('firing gather votes cron for eventID: ' + event.id);
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
										Sender.sendSMS(recipient, 'Event\n', 'Votes Are In!\n' + event.votes.yes.length + ' people voted YES \n' + event.votes.no.length + ' people voted NO \n', senderCallback(user));
									}

									if(user.preferences.receiveEmails) {

										Sender.sendSMS(user.email, 'Event', 'Votes Are In!\n' + event.votes.yes.length + ' people voted YES \n' + event.votes.no.length + ' people voted NO \n', senderCallback(user));
									}
								}
							});
						});
					};

					console.log('event time: ' + event.time);
					console.log('event id: ' + event.id);
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

						key: event.id,
						settings: settings

					};

					Cron.addJob(cron.key,job);

					done(null,arg1,arg2);
				};
			},
			eventStartNotifications: function(req,event) {

				return function(arg1,arg2,done) {

					var query = {

						_id: event.id

					};

					getEvent(event,function(err,event) {

						query = createEventMembersQuery(event);

						Helper.findWithAllAtts(User,query,function(err,users) {

							for(var i = 0; i < users.length; ++i) {

								var user = users[i];
								
								var eventURL = 'http://'+req.headers.host+'/#!/groups/'+event.group.id+'/events/'+event.id;
								var settingsURL = 'http://'+req.headers.host+'/#!/settings/me/notifications';
								var eventEndDate = new Date(event.time);
								eventEndDate = dateFormat(eventEndDate, 'dddd mmmm dS "at" h:MM TT');
								
								if(user.preferences.receiveTexts) {

									var recipient = user.phoneNumber + user.carrier;
									Sender.sendSMS(recipient, 'Sports Scheduler', 'Event for Group: '+event.group.name+' has started!\nVote at: ' + eventURL + '\nVoting Ends: ' + eventEndDate + '\nUnsubscribe from notifications: '+settingsURL, senderCallback(user));
								}

								if(user.preferences.receiveEmails) {

									Sender.sendSMS(user.email, 'Sports Scheduler\n', 'Event for Group: '+event.group.name+' has started!\nTo vote go to\n' + eventURL + '\n\nVoting Ends at: ' + eventEndDate + '\nTo unsubscribe from notifications go to\n'+settingsURL, senderCallback(user));
								}
							}

							done(null,arg1,arg2);
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
			notifiyUsersOfEventCancellation: function(event) {

				return function(arg1,arg2,done) {

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

									Sender.sendSMS(user.email, 'Sports Scheduler', 'Event: ' + event.name + ' for Group: '+event.group.name+' has been canceled', senderCallback(user));
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
