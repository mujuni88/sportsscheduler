'use strict';

angular.module('userform').factory('Userform', ['$resource',
    function ($resource) {

        return $resource('/form/:formId', {
            formId: '@_id'
        }, {
            'update': {method: 'PUT'}
        })
    }
]);