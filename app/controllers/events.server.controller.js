'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	EventModel = mongoose.model('Event'),
	MyResponse = require('../custom_objects/MyResponse'),
	serverJSON = require('../local_files/ui/server.ui.json'),
	Helper = require('../custom_objects/Helper'),
	_ = require('lodash');

/**
 * Create a Event
 */
exports.create = function(req, res) {
	var event = new EventModel(req.body);
	event.user = req.user;

	event.save(function(err) {
		console.log('in create event save');
		var myResponse = new MyResponse();

		if (err) {
			console.log('error: ' + err);
			myResponse.transformMongooseError('api.users.groups.events',String(err));
			res.json(myResponse);
			// if(err.errors)
			// {
			// 	for(var property in err.errors)
			// 	{
			// 		console.log(err.errors[property]);
			// 		console.log('prop: ' + property);
			// 		var errorObj = myResponse.getErrorObjectByClientMessage(err.errors[property].message);
			// 		myResponse.setError(errorObj);
			// 		res.json(myResponse);
			// 		return;
			// 	}
			// }
		}
		else {
			console.log('saved successfully');
			Helper.populateModel(EventModel,event,'api.users.groups.events',res);
		}
	});
};

/**
 * Show the current Event
 */
exports.read = function(req, res) {
	//console.log(req.event);
	//res.jsonp(req.event);
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
			myResponse.transformMongooseError('api.users.groups.events',String(err));
			res.json(myResponse);
		}
		else if(!event)
		{
			myResponse.setError(serverJSON.api.users.groups.events._id.invalid);
			res.json(myResponse);
		}
		else
		{
			event = _.extend(event , req.body);
			console.log('event: ' + event);
			event.updated = Date.now();

			event.save(function(err) {
				console.log('err: ' + err);
				if (err) {
					myResponse.transformMongooseError('api.users.groups.events',String(err));
					res.json(myResponse);
				} else {
					Helper.populateModel(EventModel,event,'api.users.groups.events',res);
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
			res.status(400);
			res.json(errorHandler.getErrorMessage(err));
		}
		else if(!event)
		{
			myResponse.setError(serverJSON.api.users.groups.events._id.invalid);
			res.json(myResponse);
		}
		else
		{
			event.remove(function(err) {
				if (err) {
					res.status(400);
					res.json(errorHandler.getErrorMessage(err));
				} else {
					Helper.populateModel(EventModel,event,'api.users.groups.events',res);
				}
			});
		}

	});
};

/**
 * List of Events
 */
exports.list = function(req, res) { EventModel.find().sort('-created').populate(EventModel.objectIDAtts).exec(function(err, events) {
		
		var myResponse = new MyResponse();

		if (err) {
			myResponse.transformMongooseError('api.users.groups.events',String(err));
			res.json(myResponse);
		} else {
			Helper.populateModel(EventModel,events,'api.users.groups.events',res);
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
		myResponse.setError(serverJSON.api.users.groups.events._id.invalid);
		res.json(myResponse);
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
