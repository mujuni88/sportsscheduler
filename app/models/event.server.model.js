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
		required: serverJSON.api.users.groups.events.name.empty.clientMessage,
		match: [new RegExp(serverJSON.api.users.groups.events.name.invalid.regex), serverJSON.api.users.groups.events.name.invalid.clientMessage],
		//validate: [validateNameProperty, serverJSON.api.users.groups.events.errors._2.clientMessage],
		default: '',
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
			required: serverJSON.api.users.groups.events.location.address.empty.clientMessage,
			match: [new RegExp(serverJSON.api.users.groups.events.location.address.invalid.regex), serverJSON.api.users.groups.events.location.address.invalid.clientMessage],
			trim: true
		},
		lat: {
			type: Number,
			//required: serverJSON.api.users.groups.events.errors._3.clientMessage,
			default: -1
		},
		lng: {
			type: Number,
			//required: serverJSON.api.users.groups.events.errors._4.clientMessage,
			default: -1
		}
	},
	date:{
		type: Date,
		required: serverJSON.api.users.groups.events.date.empty.clientMessage,
		match: [new RegExp(serverJSON.api.users.groups.events.date.invalid.regex), serverJSON.api.users.groups.events.date.invalid.clientMessage],
	},
	time:{
		type: Date,
		required: serverJSON.api.users.groups.events.time.empty.clientMessage,
		match: [new RegExp(serverJSON.api.users.groups.events.time.invalid.regex), serverJSON.api.users.groups.events.time.invalid.clientMessage],
	},
	voteEnabled:{
		type:Boolean,
		default:true
	},
	minimumVotes:{
		type:Number,
		required: serverJSON.api.users.groups.events.minimumVotes.empty.clientMessage
	},
	votes: 
	{
		yes: 
		[
			{
				type: Schema.ObjectId,
				ref: 'User'
			}
		],
		no: 
		[
			{
				type: Schema.ObjectId,
				ref: 'User'
			}
		],
	},

	message:{
		type: String,
		required: serverJSON.api.users.groups.events.message.empty.clientMessage
	},
	group: {
		type: Schema.ObjectId,
		ref: 'Group',
		required: serverJSON.api.users.groups.events.group.empty.clientMessage
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

EventSchema.statics.objectIDAtts = ['user','group'];
EventSchema.statics.title = serverJSON.constants.events;
EventSchema.statics.errPath = 'api.users.groups.events';

/*********** Validate Functions **************/
EventSchema.path('group').validate(function (id,respond) {

	var Group = mongoose.model('Group');
	console.log('validate group');
	
	async.waterfall([
		Helper.isValidObjectID(id, Group)
    ], function (error, success) {
        if (error) 
        	respond(false); 
        else
        	respond(true);
    });
	
	
},serverJSON.api.users.groups.events.group.invalid.clientMessage);

EventSchema.path('user').validate(function (id,respond) {

	var User = mongoose.model('User');
	console.log('validate user');
	
	async.waterfall([
		Helper.isValidObjectID(id, User)
    ], function (error, success) {
        if (error) 
        	respond(false);
        else
        	respond(true);
    });
	
},serverJSON.api.users.groups.events.user.invalid.clientMessage);

EventSchema.path('votes.yes').validate(function (ids,respond) {

	var User = mongoose.model('User');
	console.log('validate votes "yes"');
	
	async.waterfall([
		Helper.isValidObjectIDs(ids, User)
    ], function (error, success) {
        if (error) 
        	respond(false);
        else
        	respond(true);
    });
	
},serverJSON.api.users.groups.events.votes.yes.invalid.clientMessage);

EventSchema.path('votes.no').validate(function (ids,respond) {

	var User = mongoose.model('User');
	console.log('validate votes "no"');
	
	async.waterfall([
		Helper.isValidObjectIDs(ids, User)
    ], function (error, success) {
        if (error) 
        	respond(false);
        else
        	respond(true);
    });
	
},serverJSON.api.users.groups.events.votes.no.invalid.clientMessage);

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
		err.errors.votes = new ValidatorError('votes.yes', serverJSON.api.users.groups.events.votes.yes.unique.clientMessage, 'notunique', '');
	  	
	  	console.log(err);
	  	
	  	next(err);
	 }
	 else
	 	next();
});

/*********** END PRE Functions ***********/

mongoose.model('Event', EventSchema);
