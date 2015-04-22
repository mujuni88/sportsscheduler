'use strict';

/*
 * Module dependencies.
 */
var _ = require('lodash'),
	mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	serverJSON = require('../local_files/ui/server.ui.json'),
	Helper = require('../custom_objects/Helper'),
	async = require('async'),
	ValidationError = require('mongoose/lib/error/validation'),
	ValidatorError =  require('mongoose/lib/error/validator');

var validateNameProperty = function(property)
{
	var regEx = new RegExp(/^[\d\w\-\s]{5,30}$/);
	console.log('property: ' + property);
	return regEx.test(property);
};

/**
 * Event Schema
 */
var EventSchema = new Schema({
	name: {
		type: String,
		required: 'name.empty',
		//match: [new RegExp(serverJSON.api.events.name.invalid.regex), 'name.invalid'],
		//validate: [validateNameProperty, serverJSON.api.events.errors._2],
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	location:{
		//type: Object,
		//required: 'Please fill location name',
		name: {
			type: String,
			default: '',
			trim: true
		},
		address: {
			type: String,
			required: 'location.address.empty',
			//match: [new RegExp(serverJSON.api.events.location.address.invalid.regex), 'location.address.invalid'],
			trim: true
		},
		lat: {
			type: Number,
			//required: serverJSON.api.events.errors._3,
			default: -1
		},
		lng: {
			type: Number,
			//required: serverJSON.api.events.errors._4,
			default: -1
		}
	},
	date:{
		type: Date,
		required: 'date.empty',
		//match: [new RegExp(serverJSON.api.events.date.invalid.regex), 'date.invalid'],
	},
	time:{
		type: Date,
		required: 'time.empty',
		//match: [new RegExp(serverJSON.api.events.time.invalid.regex), 'time.invalid'],
	},
	voteEnabled:{
		type:Boolean,
		default:true
	},
	minimumVotes:{
		type:Number,
		required: 'minimumVotes.empty'
	},
	votes: 
	{
		yes:
		{
			type: [Schema.ObjectId],
			ref: 'User',
			validate:
			[
				{
					validator: Helper.isValidObjectIDs,
					msg: 'votes.yes.invalid'
				},
				{
					validator: Helper.isUniqueArray,
					msg: 'votes.yes.duplicate'
				}
			]
		},
		no:
		{
			type: [Schema.ObjectId],
			ref: 'User',
			validate:
			[
				{
					validator: Helper.isValidObjectIDs,
					msg: 'votes.no.invalid'
				},
				{
					validator: Helper.isUniqueArray,
					msg: 'votes.no.duplicate'
				}
			]
		},
	},

	message:{
		type: String,
		required: 'message.empty'
	},
	group: {
		type: Schema.ObjectId,
		ref: 'Group',
		//required: serverJSON.api.events.group.empty,
		validate: 
		[
			{
				validator: Helper.isValidObjectID,
				msg: 'group.invalid'
			}
		]
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

EventSchema.statics.objectIDAtts = [
	{
		name: 'user',
		model: 'User'
	},
	{
		name: 'group',
		model: 'Group'
	},
	{
		name: 'votes.yes',
		model: 'User'
	},
	{
		name: 'votes.no',
		model: 'User'
	}
];

EventSchema.statics.title = serverJSON.constants.events;
EventSchema.statics.errPath = 'api.events';

/*********** Validate Functions **************/
EventSchema.path('group').validate(function (id,respond) {

	var Group = mongoose.model('Group');
	var query = {
		_id : id
	};

	console.log('validate group: ' + id);
	
	Helper.find(Group,query,function(err,mod) {

		if(err || !mod) 
			respond(false);
		else
			respond(true);
	});
	
	
},'group.exist');

EventSchema.path('votes.yes').validate(function (ids,respond) {

	if(ids.length === 0)
		respond(true);

	var User = mongoose.model('User');
	var query = {
    	_id: 
    	{
    		$in: ids
    	}
    };

	console.log('validate votes "yes"' + ids);
	
	Helper.find(User,query,function(err,mods) {

		if(err || !mods || ids.length !== mods.length) 
			respond(false);
		else
			respond(true);
	});
	
},'votes.yes.exist');

EventSchema.path('votes.no').validate(function (ids,respond) {

	if(ids.length === 0)
		respond(true);

	var User = mongoose.model('User');
	var query = {
    	_id: 
    	{
    		$in: ids
    	}
    };

	console.log('validate votes "no"' + ids);
	
	Helper.find(User,query,function(err,mods) {

		if(err || !mods || ids.length !== mods.length) 
			respond(false);
		else
			respond(true);
	});
	
},'votes.no.exist');

/*********** END Validate Functions **************/

/*********** PRE Functions ***********/
EventSchema.pre('save', function (next) {
	
	console.log('event pre save: ' + this);

	var yesArr = [];
	var noArr = [];
	var i = null;

	for(i = 0; i < this.votes.yes.length; ++i)
		yesArr.push(this.votes.yes[i].toString());

	for(i = 0; i < this.votes.no.length; ++i)
		noArr.push(this.votes.no[i].toString());

	console.log('yesArr: ' + yesArr);
	console.log('noArr: ' + noArr);

	var intersection = _.intersection(yesArr,noArr);


	console.log('intersection: ' + intersection);
	if(intersection.length)
	{
		var err = new ValidationError(this);
		err.errors.votes = new ValidatorError('votes.yes', 'votes.yes.duplicate', 'notunique', '');
	  	
	  	console.log(err);
	  	
	  	next(err);
	 }
	 else
	 	next();
});

/*********** END PRE Functions ***********/

mongoose.model('Event', EventSchema);
