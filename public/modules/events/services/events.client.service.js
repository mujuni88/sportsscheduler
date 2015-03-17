'use strict';

//Events service used to communicate Events REST endpoints
angular.module('events').factory('Events', ['$resource',
	function($resource) {
		return $resource('/api/users/groups/events/:eventId', { eventId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
            query:{
                method: 'GET',
                isArray:true
            }
		});
	}
]);
