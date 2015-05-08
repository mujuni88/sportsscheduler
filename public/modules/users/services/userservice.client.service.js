'use strict';

angular.module('users').factory('UserService', UserService);

function UserService($http){
	var service = {
		joinGroupAndUser:joinGroupAndUser
	},
	url = '/api/users/joinGroup';
	return service;

	function joinGroupAndUser(user, group){
		return $http.post(url,{user:user, group:group})
		.success(function(data){
			return data;
		});
	}

}
