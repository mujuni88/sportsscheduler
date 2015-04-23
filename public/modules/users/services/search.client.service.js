'use strict';

angular.module('users').
	factory('Search', Search);

function Search($http){
	var service = {
        getUsers:getUsers,
		getGroups:getGroups
	};
    
    return service;

    function getUsers(val) {
        return $http.get('/api/users/', {
            params: {
                username: val
            }
        }).then(function(response){
            return response.data;
        });
    }
    function getGroups(val) {
        return $http.get('/api/users/groups/', {}).then(function(response){
            return response.data;
        });
    }
}
