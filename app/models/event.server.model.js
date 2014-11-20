'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	serverJSON = require('../local_files/ui/server.ui.json');

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
		required: serverJSON.api.users.groups.events.errors._1.clientMessage,
		validate: [validateNameProperty, serverJSON.api.users.groups.events.errors._2.clientMessage],
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
			required: serverJSON.api.users.groups.events.errors._8.clientMessage,
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
		required: serverJSON.api.users.groups.events.errors._5.clientMessage
	},
	time:{
		type: Date,
		required: serverJSON.api.users.groups.events.errors._6.clientMessage
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
	//voters:[ {type:Schema.ObjectId, ref:'User'} ],
	message:{
		type: String,
		required: serverJSON.api.users.groups.events.errors._7.clientMessage
	}

});

mongoose.model('Event', EventSchema);
