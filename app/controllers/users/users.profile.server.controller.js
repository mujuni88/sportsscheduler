'use strict';

var MyResponse = require('../../custom_objects/MyResponse');
var Sender = require('../../custom_objects/Sender');
var serverJSON = require('../../local_files/ui/server.ui.json');

/**
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
	var user = req.user;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;

		user.save(function(err) {
			var myResponse = new MyResponse();

			if (err) {
				myResponse.transformMongooseError('api.users',String(err));
				res.json(myResponse);
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.jsonp(user);
					}
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

exports.delete = function(req, res) {

	var myResponse = new MyResponse();
	var username = req.params.username;

	User.findOne({username: username}, function(err,user) {

		if (err) 
		{
			myResponse.transformMongooseError('api.users',String(err));
			res.json(myResponse);
		} 
		else
		{
			user.remove();
			req.user = null;
			//res.send(username + ' has been deleted');
			myResponse.data = user;
			res.json(myResponse);
		}
	});
};

exports.list = function(req, res) { User.find().sort('-created').populate('user', 'displayName').exec(function(err, users) {
		
		var myResponse = new MyResponse();

		if (err) {
			myResponse.transformMongooseError('api.users',String(err));
			res.json(myResponse);
		} else {
			myResponse.data = users;
			res.jsonp(myResponse);
		}
	});
};

/**
 * Send User
 */
exports.me = function(req, res) {
	res.jsonp(req.user || null);
};