'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	serverJSON = require('../local_files/ui/server.ui.json');

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
		required: serverJSON.api.users.groups.errors._1.clientMessage,
		validate: [validateNameProperty, serverJSON.api.users.groups.errors._2.clientMessage],
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
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Group', GroupSchema);