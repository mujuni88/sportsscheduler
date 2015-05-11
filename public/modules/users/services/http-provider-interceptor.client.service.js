(function () {
    'use strict';

// Authentication service for user variables
    angular.module('users').factory('HttpProviderInterceptor', HttpProviderInterceptor);

    function HttpProviderInterceptor($q, $location, Authentication, growl) {
        var provider =  {
            responseError: responseError
        };
        
        return provider;

        function responseError(rejection) {
            switch (rejection.status) {
                case 400:
                    if(rejection.data){
                        var data = rejection.data, config = {};
                        data.clientMessage.forEach(function(msg){
                            config.title = msg;
                            growl.warning(msg, config);
                        });
                        data.devMessage.forEach(function(msg){
                            config.title = msg;
                            growl.warning(msg,config);

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
                case 500:
                    var config = {title:'Sorry, We are having internal server issues :('};
                    growl.warning(config.title, config);
                    break;
                
            }

            return $q.reject(rejection);
        }
    }
}).call(this);
