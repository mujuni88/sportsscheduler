'use strict';

var MyResponse = require('../../custom_objects/MyResponse');
var Sender = require('../../custom_objects/Sender');
var serverJSON = require('../../local_files/ui/server.ui.json');
var Helper = require('../../custom_objects/Helper');

/*
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User');

/**
 * Update user details
 */
exports.update = function(req, res) {
	
	// Init Variables
	var id = req.params.userId;
	var message = null;
	var myResponse = new MyResponse();

	User.findOne({_id: id})
	.populate({path: Helper.getAttsString(User.objectIDAtts)})
	.exec(function (err, user) {
		if (user) {
			
			// For security measurement we remove the roles from the req.body object
			delete req.body.roles;
			
			// Merge existing user
			user = _.extend(user, req.body);
			var data = _.merge(user,req.body,Helper.cleanMergeObj);
			_.extend(user,data);
			
			user.updated = Date.now();
			user.displayName = user.firstName + ' ' + user.lastName;

			user.save(function(err) {
				

				if (err) {
					myResponse.transformMongooseError(User.errPath,String(err));
					Helper.output(myResponse,res);
				} else {
					req.login(user, function(err) {
						if (err) {
							console.log('error: ' + err);
							myResponse.transformMongooseError(User.errPath,String(err));
							Helper.output(myResponse,res);
						}
						else {
							console.log('saved successfully');
							Helper.populateModel(User,user,User.errPath,function(mod) {
								myResponse.setData(mod);
								Helper.output(myResponse,res);
							});
						}
					});
				}
			});
		} else {
			myResponse.transformMongooseError(User.errPath,String(err));
			Helper.output(myResponse,res);
		}
	});
};

exports.delete = function(req, res) {

	var myResponse = new MyResponse();
	var username = req.params.username;

	User.findOne({username: username}, function(err,user) {

		if (err) {
			console.log('error: ' + err);
			myResponse.transformMongooseError(User.errPath,String(err));
			Helper.output(myResponse,res);
		}
		else if(!user)
		{
			myResponse.addMessages(serverJSON.api.users._id.invalid);
			Helper.output(myResponse,res);
		}
		else {
			console.log('deleted successfully');
			user.remove();
			req.user = null;
			Helper.populateModel(User,user,User.errPath,function(mod) {
				myResponse.setData(mod);
				Helper.output(myResponse,res);
			});
		}
	});
};

exports.list = function(req, res) { User.find().sort('-created').populate(User.objectIDAtts + ' createdGroups.admins').exec(function(err, users) {
		
		var myResponse = new MyResponse();
		console.log('list');

		var username = req.query.username;
		console.log('username: ' + username);
		console.log('users: ' + users);
		if(username)
		{
			var regex = ".*"+username+".*";
			console.log('regex: ' + regex);

			User.find({
				username: 
				{
					$regex: new RegExp(regex,'i')
				}
			})
			.select('_id username email createdGroups joinedGroups')
			.exec(function(err,users) {
				console.log('err: ' + err);

				if (err) {
					myResponse.transformMongooseError(User.errPath,String(err));
					Helper.output(myResponse,res);
				} else {
					Helper.populateModel(User,users,User.errPath,function(mod) {
						myResponse.setData(mod);
						Helper.output(myResponse,res);
					});

					//myResponse.data = users;
					//res.jsonp(myResponse);
				}
			});
		}
		else
		{
			if (err) {
				myResponse.transformMongooseError(User.errPath,String(err));
				Helper.output(myResponse,res);
			} else {
				//myResponse.data = users;
				//res.jsonp(myResponse);
				Helper.populateModel(User,users,User.errPath,function(mod) {
					myResponse.setData(mod);
					Helper.output(myResponse,res);
				});
			}
		}
	});
};

/**
 * Send User
 */
exports.me = function(req, res) {
	res.jsonp(req.user || null);
};