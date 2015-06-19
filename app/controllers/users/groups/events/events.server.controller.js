'use strict';

/*
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('../../../errors'),
	EventModel = mongoose.model('Event'),
	MyResponse = require('../../../../custom_objects/MyResponse'),
	serverJSON = require('../../../../local_files/ui/server.ui.json'),
	Helper = require('../../../../custom_objects/Helper'),
	async = require('async'),
	Group = mongoose.model('Group'),
	CronJob = require('cron').CronJob,
	Cron = require('../../../../custom_objects/Cron'),
	PrivateFunctions = require('./_privateFunctions'),
	_ = require('lodash');

/**
 * Create a Event
 */

function cron () {
	console.log('cron');
	new CronJob('* * * * * *', function() {
		console.log('You will see this message every second');
	}, 
	null, 
	true, 
	'America/Los_Angeles');
}

exports.cron = function(req, res) {

	//var eventID = req.params.eventId;
	
	var time = require('time');

	var convertedTime = new time.Date(req.body.time);
	convertedTime.setTimezone('America/Chicago');

	var settings = {
  		cronTime: new Date(convertedTime),
  		onTick: function() {
    		console.log('You will see this message every second');
  		},
  		start: true,
  		timeZone: 'America/Chicago'
	};

	var job = new CronJob(settings);

	var cron = {
		key: req.body.time,
		settings: settings
	};

	Cron.addJob(cron.key,job);
	res.json(convertedTime);
};

exports.create = function(req, res) {

	var groupID = req.params.groupId;
	var query = {
		_id : groupID
	};

	Helper.find(Group,query,function(err,mod) {
		var group = null;
		var myResponse = new MyResponse();
		
		if(mod.length === 0)
		{
			myResponse.addMessages(serverJSON.api.groups._id.invalid);
			Helper.output(EventModel,null,myResponse,res);
			
			return;
		}

		group = mod[0];

		console.log('group: ' + group);

		
		var event = new EventModel(req.body);
	
		//event.user = req.user;
		event.group = groupID;

		console.log('event: ' + event);

		event.save(function(err) {
			
			if (err) {
				console.log('error: ' + err);
				myResponse.transformMongooseError(EventModel.errPath,String(err));
				Helper.output(EventModel,null,myResponse,res);
			}
			else {

				var functionsArray = [];
				functionsArray.push(PrivateFunctions.create.addEventToGroup(group,event._id));
				functionsArray.push(PrivateFunctions.create.createGatherVotesCron(event));
				functionsArray = Helper.buildWaterfall(functionsArray);

				Helper.executeWaterfall(functionsArray,function (err, obj) {
					if (err) {
						console.log('error: ' + err);
						myResponse.transformMongooseError(err.model.errPath,String(err));
						Helper.output(err.model,obj,myResponse,res);
					}
					else
                		Helper.output(EventModel,event,myResponse,res);
                });

				
			}			
		});
	});
	
};

/**
 * Show the current Event
 */
exports.read = function(req, res) {
	//console.log(req.event);
	//res.jsonp(req.event);

	var myResponse = new MyResponse();
	var eventID = req.params.eventId;

	if(!Helper.isValidObjectID(eventID))
	{
		myResponse.addMessages(serverJSON.api.events._id.invalid);
		Helper.output(EventModel,event,myResponse,res);
		
		return;
	}

	var query = {
		_id: eventID
	};

	Helper.find(EventModel,query,function(err,mod) {

		if(err || mod.length === 0)
		{
			myResponse.addMessages(serverJSON.api.events._id.exist);
			Helper.output(EventModel,null,myResponse,res);

			return;
		}

		var event = mod[0];
		Helper.output(EventModel,event,myResponse,res);
	});
};

/**
 * Update a Event
 */
exports.update = function(req, res) {
	
	var myResponse = new MyResponse();
	var id = req.params.eventId;
	var query = {
		_id : id
	};

	EventModel.findOne({_id: id}, function(err,event) {
		
		var myResponse = new MyResponse();

		if(err)
		{
			console.log(err);
			myResponse.transformMongooseError(EventModel.errPath,String(err));
			Helper.output(EventModel,null,myResponse,res);
		}
		else if(!event)
		{
			myResponse.addMessages(serverJSON.api.events._id.invalid);
			Helper.output(EventModel,null,myResponse,res);
		}
		else
		{
			if(typeof req.body.votes !== 'undefined')
			{
				console.log('begin votes: ' + JSON.stringify(req.body.votes,null,1));
				var yesVotes = req.body.votes.yes;
				var noVotes = req.body.votes.no;

				var i = 0;

				req.body.votes.yes = [];
				req.body.votes.no = [];

				for(i = 0; i < yesVotes.length; ++i)
					req.body.votes.yes.push(yesVotes[i]._id);

				for(i = 0; i < noVotes.length; ++i)
					req.body.votes.no.push(noVotes[i]._id);

				req.body.votes.yes = _.uniq(req.body.votes.yes);
				req.body.votes.no = _.uniq(req.body.votes.no);

				console.log('votes: ' + JSON.stringify(req.body.votes,null,1));
			}

			//EventModel.findByIdAndUpdate(id,req.body,function(err,event) {
			EventModel.update(
			{
				_id : id
			},
			{
				'$set':req.body
			},
			{
				runValidators: true
			},
			function(err) {
				console.log('err: ' + err);

				if (err) {
					myResponse.transformMongooseError(EventModel.errPath,String(err));
					Helper.output(EventModel,null,myResponse,res);
				}
				else
				{
					Helper.find(EventModel,query,function(err,mod) {

						var event = mod[0];

						if (err) {
							myResponse.transformMongooseError(EventModel.errPath,String(err));
							Helper.output(EventModel,null,myResponse,res);
						}
						else
							Helper.output(EventModel,event,myResponse,res);
					});
				}
				
			});
		}
	});
};

/**
 * Delete an Event
 */
exports.delete = function(req, res) {
	
	console.log(req.params);
	var id = req.params.eventId;
	console.log('event id: ' + id);
	var myResponse = new MyResponse();

	EventModel.findOne({_id: id}, function(err,event) {
		if(err)
		{
			myResponse.transformMongooseError(EventModel.errPath,String(err));
			Helper.output(EventModel,null,myResponse,res);
		}
		else if(!event)
		{
			myResponse.addMessages(serverJSON.api.events._id.invalid);
			Helper.output(EventModel,null,myResponse,res);
		}
		else
		{
			event.remove(function(err) {
				if (err) {
					myResponse.transformMongooseError(EventModel.errPath,String(err));
				} 

				Helper.output(EventModel,event,myResponse,res);
			});
		}

	});
};

/**
 * List of Events
 */
exports.list = function(req, res) { EventModel.find().sort('-created').exec(function(err, events) {
		
		var myResponse = new MyResponse();

		var eventName = req.query.event_name;
		console.log('eventName: ' + eventName);
		if(eventName)
		{
			var regex = ".*"+eventName+".*";
			console.log('regex: ' + regex);

			var query = {
				name: 
				{
					$regex: new RegExp(regex,'i')
				}
			};

			Helper.find(EventModel,query,function(err,mod) {

				if (err) {
					myResponse.transformMongooseError(EventModel.errPath,String(err));
					Helper.output(EventModel,null,myResponse,res);
				}
				else if(!mod) {
					myResponse.addMessages(serverJSON.api.events._id.exist);
					Helper.output(EventModel,null,myResponse,res);
				}
				else
				{
					Helper.output(EventModel,mod,myResponse,res);
				}
			});
		}
		//Show all events if none are found in the DB
		else
		{
			if (err) {
				myResponse.transformMongooseError(EventModel.errPath,String(err));
			} 

			Helper.output(EventModel,events,myResponse,res);

			cron();
		}
	});
};

exports.listEventsForGroup = function(req, res) {

	var myResponse = new MyResponse();
	var groupID = req.params.groupId;
	var query = {
		_id : groupID
	};

	Helper.find(Group,query,function(err,mod) {

		if (err) {
			myResponse.transformMongooseError(Group.errPath,String(err));
			Helper.output(Group,null,myResponse,res);
		}
		else if(mod.length === 0 || !mod) {
			myResponse.addMessages(serverJSON.api.group._id.exist);
			Helper.output(Group,null,myResponse,res);
		}
		else {
			
			var group = mod[0];

			query = {
				_id: 
				{ 
					$in: group.events
				}
			};

			Helper.find(EventModel,query,function(err,mod) {

				if(err)
				{
					myResponse.transformMongooseError(EventModel.errPath,String(err));
					Helper.output(EventModel,null,myResponse,res);
				}
				else
					Helper.output(EventModel,mod,myResponse,res);				
			});
		}
	});
};

/**
 * Event middleware
 */
exports.eventByID = function(req, res, next, id) { 

	var myResponse = new MyResponse();
	
	if(!mongoose.Types.ObjectId.isValid(id))
	{
		myResponse.addMessages(serverJSON.api.events._id.invalid,res);
		Helper.output(EventModel,null,myResponse,res);
		//next();
		return;
	}

	EventModel.findById(id).populate('group', 'name').exec(function(err, event) {
		// if (err) return next(err);
		// if (! event) return next(new Error('Failed to load Event ' + id));
		req.event = event ;
		// next();
		//if(err)
		//	res.json(errorHandler.getErrorMessage(err));
		next();
	});
};

/**
 * Event authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.event.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
