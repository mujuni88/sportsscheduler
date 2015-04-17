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

function isValidObjectIDs(ids) {

	console.log('addedByIDS: ' + ids);
	if(!Helper.isValidObjectIDs(ids))
	{
		console.log('failed');
		return false;
	}

	return true;
}

function isUniqueArray(ids) {
	
	if(!Helper.isUniqueArray(ids))
		return false;

	return true;
}

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
		required: 'firstName.empty',
		match: [new RegExp(serverJSON.api.users.firstName.invalid.regex), 'firstName.invalid']
	},
	lastName: {
		type: String,
		trim: true,
		required: 'lastName.empty',
		match: [new RegExp(serverJSON.api.users.lastName.invalid.regex), 'lastName.invalid']
	},
	displayName: {
		type: String,
		trim: true
	},
	email: {
		type: String,
		trim: true,
		default: '',
		match: [new RegExp(serverJSON.api.users.email.invalid.regex), 'email.invalid']
	},
	carrier: {
		type: String,
		trim: true,
		default: '',
	},
	phoneNumber: {
		type: Number,
		default: -1,
		match: [new RegExp(serverJSON.api.users.phoneNumber.invalid.regex), 'phoneNumber.invalid']
	},
	username: {
		type: String,
		unique: 'testing error message',
		required: 'username.empty',
		match: [new RegExp(serverJSON.api.users.username.invalid.regex), 'username.invalid'],
		trim: true
	},
	password: {
		type: String
	},
	plainTextPassword: {
		type: String,
		default: '',
		required: 'plainTextPassword.empty',
		match: [new RegExp(serverJSON.api.users.plainTextPassword.invalid.regex), 'plainTextPassword.invalid']
	},
	createdGroups: {
		type: [Schema.ObjectId],
		ref: 'Group',
		validate: 
		[
			{
				validator: Helper.isValidObjectIDs,
				msg: 'createdGroups.invalid'
			},
			{
				validator: Helper.isUniqueArray,
				msg: 'createdGroups.duplicate'
			}
		]
	},
	joinedGroups: {
		type: [Schema.ObjectId],
		ref: 'Group',
		validate: 
		[
			{
				validator: Helper.isValidObjectIDs,
				msg: 'joinedGroups.invalid'
			},
			{
				validator: Helper.isUniqueArray,
				msg: 'joinedGroups.duplicate'
			}
		]
	},
	addedBy: [
		{
			groupID : {
				type: Schema.ObjectId,
				ref: 'Group',
				validate:
				[
					{
						validator: Helper.isValidObjectIDs,
						msg: 'addedBy.groupID.invalid'
					}
				]
			},
			userID: {
				type: Schema.ObjectId,
				ref: 'User'
			},
			date: {
				type: Date,
				default: Date.now
			}
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

UserSchema.statics.objectIDAtts = [
	{
		name: 'createdGroups',
		model: 'Group'
	},
	{
		name: 'joinedGroups',
		model: 'Group'
	}
];

UserSchema.statics.title = serverJSON.constants.users;
UserSchema.statics.errPath = 'api.users';

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

/*********** Validate Functions Middleware **************/

UserSchema.path('createdGroups').validate(function (ids,respond) {

	if(ids.length === 0)
		respond(true);

	var Group = mongoose.model('Group');
	var query = {
                	_id: 
                	{
                		$in: ids
                	}
                };

	console.log('validate created groups: ' + ids);

	Helper.find(Group,query,function(err,mods) {

		if(err || !mods || ids.length !== mods.length) 
			respond(false);
		else
			respond(true);
	});
	
 },'createdGroups.exist');

UserSchema.path('joinedGroups').validate(function (ids,respond) {

	if(ids.length === 0)
		respond(true);
	
	var Group = mongoose.model('Group');
	var query = {
                	_id: 
                	{
                		$in: ids
                	}
                };

	console.log('validate joined groups: ' + ids);
	
	Helper.find(Group,query,function(err,mods) {

		if(err || !mods || ids.length !== mods.length) 
			respond(false);
		else
			respond(true);
	});
	
},'joinedGroups.exist');

UserSchema.path('addedBy').schema.path('groupID').validate(function (id,respond) {

	var Group = mongoose.model('Group');
	var query = {
		_id: id
	};

	console.log('validate addedBy.groupID: ' + id);
	
	Helper.find(Group,query,function(err,mod) {
		
		if(err || !mod || typeof mod.length === 0) 
		{
			console.log('FALSE!!!');
			console.log('groupID mod: ' + mod);
			respond(false);
		}
		else
			respond(true);
	});
},'addedBy.groupID.exist');

UserSchema.path('addedBy').schema.path('userID').validate(function (id,respond) {

	var User = mongoose.model('User');
	var query = {
		_id: id
	};

	console.log('validate addedBy.userID: ' + id);
	
	Helper.find(User,query,function(err,mod) {

		if(err || !mod || typeof mod.length === 0) 
			respond(false);
		else
			respond(true);
	});
},'addedBy.userID.exist');

/*********** END Validate Functions Middleware **************/

mongoose.model('User', UserSchema);
