'use strict';

/*
 * Module dependencies.
 */
var _ = require('lodash'),
	mongoose = require('mongoose'),
	MyResponse = require('../../custom_objects/MyResponse'),
	Helper = require('../../custom_objects/Helper'),
	serverJSON = require('../../local_files/ui/server.ui.json'),
	User = mongoose.model('User');

/**
 * User middleware
 */
exports.userByID = function(req, res, next, id) {

	var myResponse = new MyResponse();
	
	if(!mongoose.Types.ObjectId.isValid(id))
	{
		myResponse.addMessages(serverJSON.api.users._id.invalid);
		Helper.output(User,null,myResponse,res);
		return;
	}

	User.findById(id).populate('user', 'displayName').exec(function(err, user) {
		
		
		req.profile = user ;

		next();
	});
	/*
	User.findOne({
		_id: id
	}).exec(function(err, user) {
		if (err) return next(err);
		if (!user) return next(new Error('Failed to load User ' + id));
		req.profile = user;
		next();
	});
*/
};

/**
 * Require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.status(401).send({
			message: 'User is not logged in'
		});
	}

	next();
};

/**
 * User authorizations routing middleware
 */
exports.hasAuthorization = function(roles) {
	var _this = this;

	return function(req, res, next) {
		_this.requiresLogin(req, res, function() {
			if (_.intersection(req.user.roles, roles).length) {
				return next();
			} else {
				return res.status(403).send({
					message: 'User is not authorized'
				});
			}
		});
	};
};