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
	_ = require('lodash');

/**
 * Create a Event
 */
exports.create = function(req, res) {
	var event = new EventModel(req.body);
	//event.user = req.user;
	console.log('event: ' + event);
	event.save(function(err) {
		console.log('in create event save');
		var myResponse = new MyResponse();

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
			var data = _.merge(event,req.body,Helper.cleanMergeObj);
			_.extend(event,data);
			console.log('event: ' + event);
			event.updated = Date.now();

			event.save(function(err) {
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
