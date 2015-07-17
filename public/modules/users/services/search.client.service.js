'use strict';

angular.module('users').
	factory('Search', Search);

function Search($http, $q){
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
            if(!angular.isObject(response.data)){
                return [];
            }
            
            return [response.data];
        });
    }
    function getGroups(val) {
        return $http.get('/api/users/groups/', {
            params: {
                name: val
            }
        }).then(function(response){
            if(!angular.isObject(response.data)){
                return $q.defer().reject(response.data);
            }

            return [response.data];
        });
    }
}
