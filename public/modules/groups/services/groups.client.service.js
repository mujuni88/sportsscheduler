(function(){
	'use strict';

//Groups service used to communicate Groups REST endpoints
	angular.module('groups').factory('Groups', ['$resource',
		function ($resource) {
			return $resource('/api/users/groups/:groupId', {
				groupId: '@_id'
			}, {
				update: {
					method: 'PUT'
				},
				query: {method: 'GET', isArray: true}
			});
		}
	]);

}).call(this);

