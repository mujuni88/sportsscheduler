'use strict';

/**
* @fileOverview User Model Declaration
* @author <a href="mailto:jd@example.com">Trey Gaines</a>
*/


/*
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto'),
	serverJSON = require('../local_files/ui/server.ui.json'),
	async = require('async'),
	Helper = require('../custom_objects/Helper');

/*
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
	return ((this.provider !== 'local' && !this.updated) || property.length);
};

var validateLocalStrategyPhoneNumber = function(number) {
	return (this.provider !== 'local' || number.toString().length >= 10);
};

/*
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function(password) {
	return (this.provider !== 'local' || (password && password.length > 6));
};

/**
	*	@class User
	*	@property {string} firstName
	*	@property {string} lastName
	*	@property {string} displayName
	*	@property {string} email
	*	@property {string} carrier
	*	@property {number} phoneNumber
	*	@property {string} username
	*	@property {string} password
	*	@property {Group[]} createdGroups
	*	@property {Group[]} joinedGroups
	*	@property {string} salt
	*	@property {string} provider
	*	@property {object} providerData
	*	@property {string} additionalProvidersData
	*	@property {string} roles enum: ['user','admin'] default: 'user'
	*	@property {date} updated
	*	@property {date} created
	*	@property {string} resetPasswordToken
	*	@property {date} resetPasswordExpires
 */

var UserSchema = new Schema({
	firstName: {
		type: String,
		trim: true,
		required: serverJSON.api.users.firstName.empty.clientMessage,
		match: [new RegExp(serverJSON.api.users.firstName.invalid.regex), serverJSON.api.users.firstName.invalid.clientMessage]
	},
	lastName: {
		type: String,
		trim: true,
		required: serverJSON.api.users.lastName.empty.clientMessage,
		match: [new RegExp(serverJSON.api.users.lastName.invalid.regex), serverJSON.api.users.lastName.invalid.clientMessage]
	},
	displayName: {
		type: String,
		trim: true
	},
	email: {
		type: String,
		trim: true,
		default: '',
		match: [new RegExp(serverJSON.api.users.email.invalid.regex), serverJSON.api.users.email.invalid.clientMessage]
	},
	carrier: {
		type: String,
		trim: true,
		default: '',
	},
	phoneNumber: {
		type: Number,
		default: -1,
		match: [new RegExp(serverJSON.api.users.phoneNumber.invalid.regex), serverJSON.api.users.phoneNumber.invalid.clientMessage]
	},
	username: {
		type: String,
		unique: 'testing error message',
		required: serverJSON.api.users.username.empty.clientMessage,
		match: [new RegExp(serverJSON.api.users.username.invalid.regex), serverJSON.api.users.username.invalid.clientMessage],
		trim: true
	},
	password: {
		type: String,
		default: '',
		required: serverJSON.api.users.password.empty.clientMessage,
		match: [new RegExp(serverJSON.api.users.password.invalid.regex), serverJSON.api.users.password.invalid.clientMessage]
	},
	createdGroups: 
	[
		{
			type: Schema.ObjectId,
			ref: 'Group'
		}
	],
	joinedGroups:
	[
		{
			type: Schema.ObjectId,
			ref: 'Group'
		}
	],
	salt: {
		type: String
	},
	provider: {
		type: String,
		required: 'Provider is required'
	},
	providerData: {},
	additionalProvidersData: {},
	roles: {
		type: [{
			type: String,
			enum: ['user', 'admin']
		}],
		default: ['user']
	},
	updated: {
		type: Date,
		default: Date.now
	},
	created: {
		type: Date,
		default: Date.now
	},
	/* For reset password */
	resetPasswordToken: {
		type: String
	},
  	resetPasswordExpires: {
  		type: Date
  	}
});

UserSchema.statics.objectIDAtts = ['createdGroups','joinedGroups'];
UserSchema.statics.title = serverJSON.constants.users;

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function(next) {
	if (this.password && this.password.length > 6) {
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.password = this.hashPassword(this.password);
	}

	//concatenate firstName and lastName to make displayName
	this.displayName = this.firstName + ' ' + this.lastName;
	
	next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(password) {
	if (this.salt && password) {
		return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
	} else {
		return password;
	}
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function(password) {
	return this.password === this.hashPassword(password);
};

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
	var _this = this;
	var possibleUsername = username + (suffix || '');

	_this.findOne({
		username: possibleUsername
	}, function(err, user) {
		if (!err) {
			if (!user) {
				callback(possibleUsername);
			} else {
				return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
			}
		} else {
			callback(null);
		}
	});
};

/*********** Validate Functions **************/

UserSchema.path('createdGroups').validate(function (ids,respond) {

	var Group = mongoose.model('Group');
	console.log('validate created groups');
	
	async.waterfall([
		Helper.isValidObjectIDs(ids, Group)
    ], function (error, success) {
        if (error) 
        	respond(false); 
        else
        	respond(true);
    });
	
},serverJSON.api.users.createdGroups.invalid.clientMessage);

UserSchema.path('joinedGroups').validate(function (ids,respond) {

	var Group = mongoose.model('Group');
	console.log('validate joined groups');
	
	async.waterfall([
		Helper.isValidObjectIDs(ids, Group)
    ], function (error, success) {
        if (error) 
        	respond(false); 
        else
        	respond(true);
    });
	
},serverJSON.api.users.joinedGroups.invalid.clientMessage);

/*********** END Validate Functions **************/

mongoose.model('User', UserSchema);
