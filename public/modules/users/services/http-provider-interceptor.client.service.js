(function () {
    'use strict';

// Authentication service for user variables
    angular.module('users').factory('HttpProviderInterceptor', HttpProviderInterceptor);

    function HttpProviderInterceptor($q, $location, Authentication, AppAlert) {
        var provider =  {
            responseError: responseError
        };
        
        return provider;

        function responseError(rejection) {
            switch (rejection.status) {
                case 400:
                    var timeout = 6000;
                    if(rejection.data){
                        var data = rejection.data;
                        data.clientMessage.forEach(function(msg){
                            AppAlert.add('danger',msg, timeout);
                        });
                        data.devMessage.forEach(function(msg){
                            AppAlert.add('danger',msg, timeout);
                        });
                    }
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
    }
}).call(this);
