(function(){
    'use strict';

    angular.module('users').factory('Authorization', Authorization);

    function Authorization($rootScope, $state, authentication) {
        var service = {
            isAuf: function () {
            }
        };

        return service;
    }

}).call(this);
