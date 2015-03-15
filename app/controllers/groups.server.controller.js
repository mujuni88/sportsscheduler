'use strict';

/*
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Group = mongoose.model('Group'),
	User = mongoose.model('User'),
	MyResponse = require('../custom_objects/MyResponse'),
	serverJSON = require('../local_files/ui/server.ui.json'),
	Helper = require('../custom_objects/Helper'),
	_ = require('lodash');

/**
 * Create a Group
 */
exports.create = function(req, res) {
	var group = new Group(req.body);
	group.admins = [req.user];
	console.log(req.user);
	group.save(function(err) {
		console.log('in save');
		var myResponse = new MyResponse();
		if (err) {
			console.log('error: ' + err);
			myResponse.transformMongooseError(Group.errPath,String(err),res);
		}
		else {
			console.log('saved successfully');
			Helper.populateModel(Group,group,'api.users.groups',res);
		}
	});
};

/**
 * Show the current Group
 */
exports.read = function(req, res) {
	
	var id = req.params.groupId;

	Group.findOne({_id: id}, function(err,group) {
		
		var myResponse = new MyResponse();

		if (err) {
			console.log('error: ' + err);
			myResponse.transformMongooseError(Group.errPath,String(err),res);
		}
		else {
			Helper.populateModel(Group,group,'api.users.groups',res);
		}
	});
};

/**
 * Update a Group
 */
exports.update = function(req, res) {
	
	var myResponse = new MyResponse();
	var id = req.params.groupId;

	Group.findOne({_id: id}, function(err,group) {
		
		var myResponse = new MyResponse();
		console.log(err);
		console.log('group1: ' + group);
		if(err)
		{
			console.log(err);
			myResponse.transformMongooseError(Group.errPath,String(err),res);
		}
		else if(!group)
		{
			myResponse.addMessages(serverJSON.api.users.groups._id.invalid);
			myResponse.setError(res);
		}
		else
		{
			group = _.extend(group , req.body);
			group.updated = Date.now();

			group.save(function(err) {
				console.log('in save');

				if (err) {
					console.log('error: ' + err);
					myResponse.transformMongooseError(Group.errPath,String(err),res);
				}
				else {
					console.log('saved successfully');
					Helper.populateModel(Group,group,'api.users.groups',res);
				}
			});
		}
	});
};

/**
 * Delete an Group
 */
exports.delete = function(req, res) {

	var id = req.params.groupId;
	console.log('group id: ' + id);
	var myResponse = new MyResponse();

	Group.findOne({_id: id}, function(err,group) {

		var myResponse = new MyResponse();
		
		if(err)
		{
			console.log(err);
			myResponse.transformMongooseError(Group.errPath,String(err),res);
		}
		else if(!group)
		{
			myResponse.addMessages(serverJSON.api.users.groups._id.invalid);
			myResponse.setError(res);
		}
		else
		{
			group.remove(function(err) {
				if (err) {
					console.log('error: ' + err);
					myResponse.transformMongooseError(Group.errPath,String(err),res);
				}
				else {
					console.log('saved successfully');
					Helper.populateModel(Group,group,'api.users.groups',res);
				}
			});
		}
	});
};

/**
 * List of Groups
 */
exports.list = function(req, res) { Group.find().sort('-created').populate(Group.objectIDAtts).exec(function(err, groups) {
		
		var myResponse = new MyResponse();

		if (err) {
			myResponse.transformMongooseError(Group.errPath,String(err),res);
		} else {
			Helper.populateModel(Group,groups,'api.users.groups',res);
		}
	});
};

/**
 * Group middleware
 */
exports.groupByID = function(req, res, next, id) { 

	var myResponse = new MyResponse();
	
	if(!mongoose.Types.ObjectId.isValid(id))
	{
		myResponse.setError(serverJSON.api.users.groups._id.invalid,res);
		return;
	}

	Group.findById(id).populate('user', 'displayName').exec(function(err, group) {
		//if (err) return next(err);
		//if (! group) return next(new Error('Failed to load Group ' + id));
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
