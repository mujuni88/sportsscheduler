'use strict';

angular.module('userform').factory('Userform', ['$resource',
    function ($resource) {

        return $resource('/test/:userId', {
            userId: '@_id'
        }, {
            'update': {method: 'PUT'}
        })
    }
]);