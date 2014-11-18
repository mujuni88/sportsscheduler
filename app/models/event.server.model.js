'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Event Schema
 */
var EventSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Event name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	group:{
		type:Schema.ObjectId,
		ref:'Group'
	},
	location:{
		type:Object,
		required:'Please fill location name',
		trim:true
	},
	date:{
		type:Date,
		required:"Please enter the event date"
	},
	time:{
		type:Date,
		required:'Please enter the event time'
	},
	voteEnabled:{
		type:Boolean,
		default:true
	},
	minimumVotes:{
		type:Number,
		default:0
	},
	vote_count:{
		type:Number,
		default:0
	},
	voters:[ {type:Schema.ObjectId, ref:'User'} ],
	message:{
		type:String,
		required:'Please enter the event message'
	}

});

mongoose.model('Event', EventSchema);
