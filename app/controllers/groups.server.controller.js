'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Group = mongoose.model('Group'),
	MyResponse = require('../custom_objects/MyResponse'),
	_ = require('lodash');

/**
 * Create a Group
 */
exports.create = function(req, res) {
	var group = new Group(req.body);
	group.user = req.user;

	group.save(function(err) { 
		console.log('in save');
		var myResponse = new MyResponse();

		if (err) {
			console.log('error: ' + err);
			res.json(errorHandler.getErrorMessage(err));
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
			myResponse.data = group;
			res.jsonp(myResponse);
		}
	});
};

/**
 * Show the current Group
 */
exports.read = function(req, res) {
	res.jsonp(req.group);
};

/**
 * Update a Group
 */
exports.update = function(req, res) {
	
	var myResponse = new MyResponse();
	var id = req.body.id;

	Group.findOne({_id: id}, function(err,group) {

		if(err)
		{
			console.log(err);
			res.json(errorHandler.getErrorMessage(err));
		}
		else
		{
			group = _.extend(group , req.body);
			group.updated = Date.now();

			group.save(function(err) {
				if (err) {
					res.json(errorHandler.getErrorMessage(err));
				} else {
					myResponse.data = group;
					res.jsonp(myResponse);
				}
			});
		}
	});
};

/**
 * Delete an Group
 */
exports.delete = function(req, res) {
	//var group = req.group ;
	console.log(req.params);
	var id = req.params.groupId;
	console.log('group id: ' + id);
	var myResponse = new MyResponse();

	Group.findOne({_id: id}, function(err,group) {
		group.remove(function(err) {
			if (err) {
				res.status(400);
				res.json(errorHandler.getErrorMessage(err));
			} else {
				res.jsonp(group);
			}
		});

	});
};

/**
 * List of Groups
 */
exports.list = function(req, res) { Group.find().sort('-created').populate('user', 'displayName').exec(function(err, groups) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(groups);
		}
	});
};

/**
 * Group middleware
 */
exports.groupByID = function(req, res, next, id) { Group.findById(id).populate('user', 'displayName').exec(function(err, group) {
		if (err) return next(err);
		if (! group) return next(new Error('Failed to load Group ' + id));
		req.group = group ;
		next();
	});
};

/**
 * Group authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.group.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};