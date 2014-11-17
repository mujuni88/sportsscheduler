'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var groups = require('../../app/controllers/groups');

	// Groups Routes
	app.route('/api/users/groups')
		.get(groups.list)
		.post(groups.create)
		.put(groups.update);
		//.post(users.requiresLogin, groups.create);

	app.route('/api/users/groups/:groupId')
		.get(groups.read)
		//.put(users.requiresLogin, groups.hasAuthorization, groups.update)
		//.delete(users.requiresLogin, groups.hasAuthorization, groups.delete);
		.delete(groups.delete);

	// Finish by binding the Group middleware
	app.param('groupId', groups.groupByID);
};