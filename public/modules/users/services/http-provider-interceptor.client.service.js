'use strict';

// Authentication service for user variables
angular.module('users').factory('HttpProviderInterceptor', ['$q', '$location', 'Authentication','$rootScope','lodash',
    function($q, $location, Authentication,$rootScope, _) {
        return {
            responseError: function(rejection) {
                switch (rejection.status) {
                    case 400:
                        $rootScope.error = rejection.data;
                        break;
                    case 401:
                        // Deauthenticate the global user
                        Authentication.user = null;

                        // Redirect to signin page
                        $location.path('signin');
                        break;
                    case 403:
                        // Add unauthorized behaviour 
                        break;
                }

                return $q.reject(rejection);
            }
        };
    }
]);
