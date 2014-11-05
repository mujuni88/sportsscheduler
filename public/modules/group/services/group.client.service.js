'use strict';

angular.module('group').factory('Group', ['$resource',
	function ($resource) {

		return $resource('/group/:groupId', {
			groupId: '@_id'
		}, {
			'update': {method: 'PUT'}
		});
	}
]);
