'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	serverJSON = require('../local_files/ui/server.ui.json'),
	Helper = require('../custom_objects/Helper');

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
	updated: {
		type: Date,
		default: Date.now
	},
	// user: {
	// 	type: Schema.ObjectId,
	// 	ref: 'User'
	// },
	// group:{
	// 	type:Schema.ObjectId,
	// 	ref:'Group'
	// },
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
		type: Boolean,
		default: true
	},
	minimumVotes:{
		type: Number,
		default: 0
	},
	vote_count:{
		type: Number,
		default: 0
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
	}

});

EventSchema.path('group').validate(function (id,respond) {

	var Group = mongoose.model('Group');
	console.log('validate group');
	
	Helper.isValidObjectID(id, Group,respond);
	
},serverJSON.api.users.groups.events.group.validate.clientMessage);

mongoose.model('Event', EventSchema);
