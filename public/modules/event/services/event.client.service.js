'use strict';

angular.module('event').factory('Event', ['$resource',
	function($resource) {
		return $resource('event/:eventId', {
			eventId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
