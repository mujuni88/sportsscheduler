'use strict';

//Setting up route
angular.module('userform').config(['$stateProvider',
	function($stateProvider) {
		// Userform state routing
		$stateProvider.
		state('userform', {
			url: '/form',
			templateUrl: 'modules/userform/views/userform.client.view.html'
		});
	}
]);