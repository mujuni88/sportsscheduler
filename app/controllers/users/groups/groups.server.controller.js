'use strict';

/*
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('../../errors'),
	Group = mongoose.model('Group'),
	User = mongoose.model('User'),
	MyResponse = require('../../../custom_objects/MyResponse'),
	serverJSON = require('../../../local_files/ui/server.ui.json'),
	Helper = require('../../../custom_objects/Helper'),
	util = require('util'),
	_ = require('lodash');

/**
 * Create a Group
 */
exports.create = function(req, res) {
	
	var group = new Group(req.body);
	console.log('original group: ' + group);
	var myResponse = new MyResponse();
	//var data = _.merge(group,{admins: req.user,createdBy : req.user},Helper.cleanMergeObj);
	//_.extend(group,data);

	//detect if group with this name has already been created
	console.log(JSON.stringify(req.body,null,4));
	
	var createdByID = null;
	//running test cases
	if(typeof req.body.createdBy !== 'undefined')
		createdByID = mongoose.Types.ObjectId(req.body.createdBy._id);
	else
		createdByID = req.user;

	var query = {
		createdBy:  req.user,
		name: group.name
	};
		
	console.log('query: ' + query);
	Helper.find(Group,query,function(err,mod) {

		console.log('mod length: ' + mod.length);
		if(err)
		{
			myResponse.transformMongooseError(Group.errPath,String(err));
			Helper.output(Group,null,myResponse,res);
		}
		else if(mod.length !== 0) 
		{
			console.log('error: ' + err);
			myResponse.addMessages(serverJSON.api.groups.name.duplicate);
			Helper.output(Group,null,myResponse,res);
		}
		else
		{	
			group.createdBy = createdByID;
			console.log('create group: ' + group);
			group.save(function(err) {
				console.log('in save');
				
				if (err) {
					console.log('error: ' + err);
					myResponse.transformMongooseError(Group.errPath,String(err));
					Helper.output(Group,group,myResponse,res);
				}
				else {
					console.log('saved successfully');
					Helper.output(Group,group,myResponse,res);
					/*
					req.user.createdGroup = group;
					req.user.save(function(userErr) {
						Helper.populateModel(Group,group,Group.errPath,function(mod) {
							myResponse.setData(mod);
							Helper.output(myResponse,res);
						});
					});
				*/
				}
			});
		}
	});
};

/**
 * Show the current Group
 */
exports.read = function(req, res) {
	
	var groupID = req.params.groupId;
	var query = {
		_id : groupID
	};

	Helper.find(Group,query, function(err,mod) {
		
		var myResponse = new MyResponse();
		var group = mod[0];
		
		if (err) {
			console.log('error: ' + err);
			myResponse.transformMongooseError(Group.errPath,String(err));
		}
		else if(mod.length === 0)
		{
			myResponse.addMessages(serverJSON.api.groups._id.exist);
		}
		
		Helper.output(Group,group,myResponse,res);
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
		if(err)
		{
			console.log(err);
			myResponse.transformMongooseError(Group.errPath,String(err));
			Helper.output(Group,group,myResponse,res);
		}
		else if(!group)
		{
			myResponse.addMessages(serverJSON.api.groups._id.invalid);
			Helper.output(Group,group,myResponse,res);
		}
		else
		{
			var data = _.merge(group,req.body,Helper.cleanMergeObj);
			_.extend(group,data);

			group.updated = Date.now();

			group.save(function(err) {
				console.log('in save');

				if (err) {
					console.log('error: ' + err);
					myResponse.transformMongooseError(Group.errPath,String(err));
				}
					Helper.output(Group,group,myResponse,res);
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
			myResponse.transformMongooseError(Group.errPath,String(err));
			Helper.output(Group,group,myResponse,res);
		}
		else if(!group)
		{
			myResponse.addMessages(serverJSON.api.groups._id.invalid);
			myResponse.setError(res);
			Helper.output(Group,group,myResponse,res);
		}
		else
		{
			group.remove(function(err) {
				if (err) {
					console.log('error: ' + err);
					myResponse.transformMongooseError(Group.errPath,String(err));
				}
				Helper.output(Group,group,myResponse,res);
			});
		}
	});
};

/**
 * List of Groups
 */
exports.list = function(req, res) { Group.find().sort('-created').exec(function(err, groups) {
		
		var myResponse = new MyResponse();

		var groupName = req.query.group_name;
		console.log('groupName: ' + groupName);
		if(groupName)
		{
			var regex = ".*"+groupName+".*";
			console.log('regex: ' + regex);

			var query = {
				name: 
				{
					$regex: new RegExp(regex,'i')
				}
			};

			Helper.find(Group,query,function(err,mod) {

				if (err) {
					myResponse.transformMongooseError(Group.errPath,String(err));
					Helper.output(Group,null,myResponse,res);
				}
				else if(!mod) {
					myResponse.addMessages(serverJSON.api.events._id.exist);
					Helper.output(Group,null,myResponse,res);
				}
				else
				{
					Helper.output(Group,mod,myResponse,res);
				}
			});
		}
		//Show all events if none are found in the DB
		else
		{
			if (err) {
				myResponse.transformMongooseError(Group.errPath,String(err));
			} 

			Helper.output(Group,groups,myResponse,res);
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
		myResponse.addMessages(serverJSON.api.groups._id.invalid);
		Helper.output(Group,null,myResponse,res);
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
