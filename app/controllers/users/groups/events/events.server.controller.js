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
	_ = require('lodash');

/**
 * Create a Event
 */
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
			Helper.output(myResponse,res);
			
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
				Helper.output(myResponse,res);
			}
			else {
				group.events.push(event._id);
				
				group.save(function(err) {

					if (err) {
						console.log('error: ' + err);
						myResponse.transformMongooseError(EventModel.errPath,String(err));
						Helper.output(myResponse,res);
					}
					else {
						console.log('saved successfully');
						Helper.populateModel(EventModel,event,EventModel.errPath,function(mod) {
							myResponse.setData(mod);
							Helper.output(myResponse,res);
						});
					}
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
		Helper.output(myResponse,res);
		
		return;
	}

	var query = {
		_id: eventID
	};

	Helper.find(EventModel,query,function(err,mod) {

		if(err || mod.length === 0)
		{
			myResponse.addMessages(serverJSON.api.events._id.exist);
			Helper.output(myResponse,res);

			return;
		}

		Helper.populateModel(EventModel,mod[0],EventModel.errPath,function(mod) {
			myResponse.setData(mod);
			Helper.output(myResponse,res);
		});
	});
};

/**
 * Update a Event
 */
exports.update = function(req, res) {
	
	var myResponse = new MyResponse();
	var id = req.params.eventId;

	EventModel.findOne({_id: id}, function(err,event) {
		
		var myResponse = new MyResponse();

		if(err)
		{
			console.log(err);
			myResponse.transformMongooseError(EventModel.errPath,String(err));
			Helper.output(myResponse,res);
		}
		else if(!event)
		{
			myResponse.addMessages(serverJSON.api.events._id.invalid);
			Helper.output(myResponse,res);
		}
		else
		{
			//var data = _.merge(event,req.body,Helper.cleanMergeObj);
			//_.extend(event,data);
			//console.log('body: ' + JSON.stringify(req.body,null,4));
			//var data = _.merge(event.toObject(),req.body);

			
			//console.log('data: ' + JSON.stringify(data,null,4));
			// _.extend(event,req.body);
			// console.log('event: ' + event);

			// event.updated = Date.now();
			// event.votes.no = [];
			// event.votes.yes = [];
			// console.log('no length: ' + req.body.votes.no.length);
			// for(var i = 0; i < req.body.votes.no.length; ++i)
			// {
			// 	event.votes.no.push( mongoose.Types.ObjectId(String(req.body.votes.no[i]._id)));
			// }

			// console.log('yes length: ' + req.body.votes.yes.length);
			// for(var j = 0; j < req.body.votes.yes.length; ++j)
			// {
			// 	event.votes.yes.push(mongoose.Types.ObjectId(String(req.body.votes.yes[j]._id)));
			// }

			var yesVotes = [];
			var noVotes = [];

			console.log(JSON.stringify(req.body.votes,null,4));
			for(var i = 0; i < req.body.votes.no.length; ++i)
			{
				noVotes.push(req.body.votes.no[i]._id);
			}

			for(var j = 0; j < req.body.votes.yes.length; ++j)
			{
				yesVotes.push(req.body.votes.yes[j]._id);
			}

			req.body.votes.yes = yesVotes;
			req.body.votes.no = noVotes;

			console.log('votes: ' + JSON.stringify(req.body.votes,null,4));
			EventModel.findByIdAndUpdate(id,req.body,function(err,event) {
				console.log('err: ' + err);

				if (err) {
					myResponse.transformMongooseError(EventModel.errPath,String(err));
					Helper.output(myResponse,res);
				} else {
					Helper.populateModel(EventModel,event,EventModel.errPath,function(mod) {
						myResponse.setData(mod);
						Helper.output(myResponse,res);
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
			Helper.output(myResponse,res);
		}
		else if(!event)
		{
			myResponse.addMessages(serverJSON.api.events._id.invalid);
			Helper.output(myResponse,res);
		}
		else
		{
			event.remove(function(err) {
				if (err) {
					myResponse.transformMongooseError(EventModel.errPath,String(err));
					Helper.output(myResponse,res);
				} else {
					Helper.populateModel(EventModel,event,EventModel.errPath,function(mod) {
						myResponse.setData(mod);
						Helper.output(myResponse,res);
					});
				}
			});
		}

	});
};

/**
 * List of Events
 */
exports.list = function(req, res) { EventModel.find().sort('-created').exec(function(err, events) {
		
		var myResponse = new MyResponse();

		if (err) {
			myResponse.transformMongooseError(EventModel.errPath,String(err));
			Helper.output(myResponse,res);
		} else {
			Helper.populateModel(EventModel,events,EventModel.errPath,function(mod) {
				myResponse.setData(mod);
				Helper.output(myResponse,res);
			});
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
			myResponse.transformMongooseError(EventModel.errPath,String(err));
			Helper.output(myResponse,res);
		}
		else if(mod.length === 0 || !mod) {
			myResponse.addMessages(serverJSON.api.events._id.exist);
			Helper.output(myResponse,res);
		}
		else {
			
			var group = mod[0];

			Helper.populateModel(Group,group,Group.errPath,function(mod) {

				var events = group.events;

				Helper.populateModel(EventModel,events,EventModel.errPath,function(mod) {
					
					myResponse.setData(mod);
					Helper.output(myResponse,res);
				});
				
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
		Helper.output(myResponse,res);
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
