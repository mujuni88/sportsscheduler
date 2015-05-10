'use strict';

/*
 * Module dependencies.
 */
var _ = require('lodash'),
	mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	serverJSON = require('../../../local_files/ui/server.ui.json'),
	async = require('async'),
	PrivateFunctions = require('./_privateFunctions'),
	Helper = require('../../../custom_objects/Helper');

/**
 * Group Schema
 */
var GroupSchema = new Schema({
	name: {
		type: String,
		required: 'name.empty',
		match: [new RegExp(serverJSON.api.groups.name.invalid.regex), 'name.invalid'],
		//validate: [validateNameProperty, serverJSON.api.groups.errors._2],
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
	{
		type: [Schema.ObjectId],
		ref: 'User',
		validate: 
		[
			{
				validator: Helper.isValidObjectIDs,
				msg: 'admins.invalid'
			},
			{
				validator: Helper.isUniqueArray,
				msg: 'admins.duplicate'
			}
		]
	},
	events: 
	{
		type: [Schema.ObjectId],
		ref: 'Event',
		validate: 
		[
			{
				validator: Helper.isValidObjectIDs,
				msg: 'events.invalid'
			},
			{
				validator: Helper.isUniqueArray,
				msg: 'events.duplicate'
			}
		]
	},
	members:
	{
		type: [Schema.ObjectId],
		ref: 'User',
		validate:
		[
			{
				validator: Helper.isValidObjectIDs,
				msg: 'members.invalid'
			},
			{
				validator: Helper.isUniqueArray,
				msg: 'members.duplicate'
			}
		]
	},
	createdBy:
	{
		type: Schema.ObjectId,
		ref: 'User',
		validate: 
		[
			{
				validator: Helper.isValidObjectID,
				msg: 'createdBy.invalid'
			}
		]
	}
});

//functions to run whenever model is outputted to the client
GroupSchema.statics.functionsArray = [
	

	PrivateFunctions.isAdmin
];

GroupSchema.statics.objectIDAtts = [
	{
		name: 'admins',
		model: 'User'
	},
	{
		name: 'events',
		model: 'Event',
	},
	{
		name: 'members',
		model: 'User',
	},
	{	name: 'createdBy',
		model: 'User'
	}
];
GroupSchema.statics.title = serverJSON.constants.groups;
GroupSchema.statics.errPath = 'api.groups';
GroupSchema.statics.attsToShow = ['_id', 'name', 'admins', 'events', 'members', 'createdBy'];

/*********** Validate Functions **************/
GroupSchema.path('admins').validate(function (ids,respond) {

	if(ids.length === 0)
		respond(true);

	var User = mongoose.model('User');
	var query = {
    	_id: 
    	{
    		$in: ids
    	}
    };

    console.log('validate admins: ' + ids);
	
	Helper.find(User,query,function(err,mods) {

		if(err || !mods || ids.length !== mods.length) 
			respond(false);
		else
			respond(true);
	});
	
},'admins.exist');

GroupSchema.path('events').validate(function (ids,respond) {

	if(ids.length === 0)
		respond(true);

	var Event = mongoose.model('Event');
	var query = {
    	_id: 
    	{
    		$in: ids
    	}
    };

	console.log('validate events: ' + ids);
	
	Helper.find(Event,query,function(err,mods) {

		if(err || !mods || ids.length !== mods.length) 
			respond(false);
		else
			respond(true);
	});
	
},'events.exist');

GroupSchema.path('members').validate(function (ids,respond) {

	if(ids.length === 0)
		respond(true);

	var User = mongoose.model('User');
	var query = {
    	_id: 
    	{
    		$in: ids
    	}
    };

	console.log('validate members: ' + ids);
	
	Helper.find(User,query,function(err,mods) {

		if(err || !mods || ids.length !== mods.length) 
			respond(false);
		else
			respond(true);
	});
	
},'members.exist');

GroupSchema.path('createdBy').validate(function (id,respond) {

	var User = mongoose.model('User');
	var query = {
		_id: id
	};

	console.log('validate createdBy: ' + id);
	
	Helper.find(User,query,function(err,mod) {

		if(err || !mod) 
			respond(false);
		else
			respond(true);
	});
	
},'createdBy.exist');

/*********** END Validate Functions **************/

GroupSchema.pre('save', function(next){
  this.members = this.members.map(function(option) { return option._id; });

  	/********** Combine admins and members and also guarantee uniqueness ***********/
  	var union = _.union(this.members,this.admins);
  	
  	var arr = _.uniq(union,false,function(obj) {
  		return obj.toString();
  	});

  	console.log('uniq: ' + arr);

  	this.members = arr;
  next();
});

mongoose.model('Group', GroupSchema);
