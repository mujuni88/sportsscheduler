'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider', config]);

function config($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push('HttpProviderInterceptor');
}
