'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	EventModel = mongoose.model('Event'),
	MyResponse = require('../custom_objects/MyResponse'),
	serverJSON = require('../local_files/ui/server.ui.json'),
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
			myResponse.data = event;
			res.jsonp(myResponse);
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
		var i = 0;
		var id = null;

		if(err)
		{
			console.log(err);
			myResponse.transformMongooseError('api.users.groups.events',String(err));
			res.json(myResponse);
		}
		else
		{
			event = _.extend(event , req.body);
			event.updated = Date.now();


			event.save(function(err) {
				console.log('err: ' + err);
				if (err) {
					myResponse.transformMongooseError('api.users.groups.events',String(err));
					res.json(myResponse);
				} else {
					myResponse.data = event;
					res.jsonp(myResponse);
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
		else
		{
			event.remove(function(err) {
				if (err) {
					res.status(400);
					res.json(errorHandler.getErrorMessage(err));
				} else {
					myResponse.data = event;
					res.jsonp(myResponse);
				}
			});
		}

	});
};

/**
 * List of Events
 */
exports.list = function(req, res) { EventModel.find().sort('-created').populate('user', 'displayName').exec(function(err, events) {
		
		var myResponse = new MyResponse();

		if (err) {
			myResponse.transformMongooseError('api.users.groups.events',String(err));
			res.json(myResponse);
		} else {
			myResponse.data = events;
			res.jsonp(myResponse);
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
		// req.event = event ;
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
