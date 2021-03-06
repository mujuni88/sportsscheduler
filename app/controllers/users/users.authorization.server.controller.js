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
	var query = {
		_id: id
	};

	if(!mongoose.Types.ObjectId.isValid(id)) {

		myResponse.addMessages(serverJSON.api.users._id.invalid);
		Helper.output(User,null,myResponse,res);
		return;
	}
		
	Helper.findOne(User,query,function(err,user) {

		req.profile = user ;

		next();
	});
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