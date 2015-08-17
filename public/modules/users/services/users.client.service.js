(function(){
    'use strict';
// Users service used for communicating with the users REST endpoint
    angular.module('users').factory('Users', Users);

    function Users($resource) {
        return $resource('/api/users/:userId', {
            userId: '@_id'
        }, {
            update: {
                method: 'PUT'
            },
            query: {
                method: 'GET',
                isArray: true
            }
        });
    }

}).call(this);
