'use strict';

/*
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	serverJSON = require('../local_files/ui/server.ui.json'),
	async = require('async'),
	Helper = require('../custom_objects/Helper');

var validateNameProperty = function(property)
{
	//console.log('answer: ' + ((this.provider !== 'local' && !this.updated) || property.length));
	//return ((this.provider !== 'local' && !this.updated) || property.length);
	var regEx = new RegExp(/^[\d\w-]{5,30}$/);
	console.log('property: ' + property);
	return regEx.test(property);
};

var validateLocalStrategyProperty = function(property) {
	return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * Group Schema
 */
var GroupSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: serverJSON.api.users.groups.name.empty.clientMessage,
		match: [new RegExp(serverJSON.api.users.groups.name.invalid.regex), serverJSON.api.users.groups.name.invalid.clientMessage],
		//validate: [validateNameProperty, serverJSON.api.users.groups.errors._2.clientMessage],
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	updated: {
		type: Date,
		default: Date.now
	},
	admins: 
	[
		{
			type: Schema.ObjectId,
			ref: 'User'
		}
	],
	events: 
	[
		{
			type: Schema.ObjectId,
			ref: 'Event'
		}
	],
	members:
	[
		{
			type: Schema.ObjectId,
			ref: 'User'
		}
	]
});

GroupSchema.statics.objectIDAtts = ['admins','events','members'];
GroupSchema.statics.title = serverJSON.constants.groups;
GroupSchema.statics.errPath = 'api.users.groups';

/*********** Validate Functions **************/
GroupSchema.path('admins').validate(function (ids,respond) {

	var User = mongoose.model('User');
	console.log('validate admins');
	
	async.waterfall([
		Helper.isValidObjectIDs(ids, User)
    ], function (error, success) {
        if (error) 
        	respond(false); 
        else
        	respond(true);
    });
	
},serverJSON.api.users.groups.admins.invalid.clientMessage);

GroupSchema.path('events').validate(function (ids,respond) {

	var Event = mongoose.model('Event');
	console.log('validate events');
	
	async.waterfall([
		Helper.isValidObjectIDs(ids, Event)
    ], function (error, success) {
        if (error) 
        	respond(false); 
        else
        	respond(true);
    });
	
},serverJSON.api.users.groups.events._id.invalid.clientMessage);

GroupSchema.path('members').validate(function (ids,respond) {

	var User = mongoose.model('User');
	console.log('validate members');
	
	async.waterfall([
		Helper.isValidObjectIDs(ids, User)
    ], function (error, success) {
        if (error) 
        	respond(false); 
        else
        	respond(true);
    });
	
},serverJSON.api.users.groups.members.invalid.clientMessage);

/*********** END Validate Functions **************/

mongoose.model('Group', GroupSchema);