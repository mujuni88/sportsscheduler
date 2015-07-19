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
	User = mongoose.model('User'),
	Group = mongoose.model('Group');

/**
 * Update user details
 */
exports.update = function(req, res) {
	
	// Init Variables
	var id = req.params.userId;
	var message = null;
	var myResponse = new MyResponse();
	var query = {
		_id: id
	};

	Helper.findOne(User,query,function (err, user) {
		
		if (!user) {

			myResponse.transformMongooseError(User.errPath,String(err));
			Helper.output(User,null,myResponse,res);
		}
		else {

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
					Helper.output(User,null,myResponse,res);
				} else {

					req.login(user, function(err) {

						if (err) {

							console.log('error: ' + err);
							myResponse.transformMongooseError(User.errPath,String(err));
						}
						
						Helper.output(User,user,myResponse,res);
					});
				}
			});
		}
	});
};

exports.delete = function(req, res) {

	var myResponse = new MyResponse();
	var username = req.params.username;
	var query = {
		username: username
	};

	Helper.findOne(User,{username: username}, function(err,user) {

		if (err) {

			console.log('error: ' + err);
			myResponse.transformMongooseError(User.errPath,String(err));
		}
		else if(!user) {

			myResponse.addMessages(serverJSON.api.users._id.invalid);
		}
		else {

			console.log('deleted successfully');
			user.remove();
			req.user = null;
		}

		Helper.output(User,user,myResponse,res);
	});
};

exports.list = function(req, res) { User.find().sort('-created').exec(function(err, users) {
		
		var myResponse = new MyResponse();
		var username = req.query.username;
		
		console.log('username: ' + username);
		console.log('users: ' + users);
		
		if(username) {

			var regex = ".*"+username+".*";
			console.log('regex: ' + regex);

			var query = {

				username:
				{
					$regex: new RegExp(regex,'i')	
				}
			};

			Helper.find(User,query,function(err,mod) {

				if (err) {

					myResponse.transformMongooseError(User.errPath,String(err));
				}
				else if(!mod) {

					myResponse.addMessages(serverJSON.api.users._id.exist);
				}

				Helper.output(User,mod,myResponse,res);
			});
		}
		//Show all users if none are found in the DB
		else {

			if (err) {

				myResponse.transformMongooseError(User.errPath,String(err));
			}

			Helper.output(User,users,myResponse,res);
		}
	});
};

exports.read = function(req, res) {

	var userID = req.params.userId;
	var query = {
		_id : userID
	};

	Helper.findOne(User,query, function(err,user) {
		
		var myResponse = new MyResponse();
		
		if (err) {

			console.log('error: ' + err);
			myResponse.transformMongooseError(user.errPath,String(err));
		}
		else if(!user) {

			myResponse.addMessages(serverJSON.api.users._id.exist);
		}
		
		Helper.output(User,user,myResponse,res);
	});
};

/**
 * Send User
 */
exports.me = function(req, res) {

	res.jsonp(req.user || null);
};