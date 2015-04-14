'use strict';

angular.module('users').
	factory('Search', Search);

function Search($http){
	var service = {
		getUsers:getUsers
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
}
