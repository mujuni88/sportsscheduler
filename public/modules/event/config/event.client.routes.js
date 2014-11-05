'use strict';

//Setting up route
angular.module('event').config(['$stateProvider',
	function($stateProvider) {
		// Event state routing
		$stateProvider.
		state('event', {
			url: '/event',
			templateUrl: 'modules/event/views/event.client.view.html'
		});
	}
]);