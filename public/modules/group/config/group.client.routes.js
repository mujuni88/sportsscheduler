'use strict';

//Setting up route
angular.module('group').config(['$stateProvider',
	function($stateProvider) {
		// Group state routing
		$stateProvider.
		state('group', {
			url: '/group',
			templateUrl: 'modules/group/views/group.client.view.html'
		});
	}
]);