'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var events = require('../../app/controllers/events');

	// Events Routes
	app.route('/api/users/groups/events')
		.get(events.list)
		//.post(users.requiresLogin, events.create);
		.post(events.create);

	app.route('/api/users/groups/events/:eventId')
		.get(events.read)
		//.put(users.requiresLogin, events.hasAuthorization, events.update)
		.put(events.update)
		//.delete(users.requiresLogin, events.hasAuthorization, events.delete);
		.delete(events.delete);

	// Finish by binding the Event middleware
	app.param('eventId', events.eventByID);
};