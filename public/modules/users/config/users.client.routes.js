(function(){
    'use strict';

// Setting up route
    angular.module('users').config(['$stateProvider',
        function ($stateProvider) {
            // Users state routing
            $stateProvider.
                state('settings', {
                    url: '/settings/me',
                    templateUrl: 'modules/users/views/settings/settings.client.view.html'
                }).
                state('settings.profile', {
                    url: '/profile',
                    templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
                }).
                state('settings.notifications', {
                    url: '/notifications',
                    templateUrl: 'modules/users/views/settings/edit-notifications.client.view.html'
                }).
                state('settings.password', {
                    url: '/password',
                    templateUrl: 'modules/users/views/settings/change-password.client.view.html'
                }).
                state('settings.accounts', {
                    url: '/accounts',
                    templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
                }).
                state('signup', {
                    url: '/signup',
                    templateUrl: 'modules/users/views/authentication/signup.client.view.html'
                }).
                state('signin', {
                    url: '/signin',
                    templateUrl: 'modules/users/views/authentication/signin.client.view.html'
                }).
                state('forgot', {
                    url: '/password/forgot',
                    templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
                }).
                state('reset-invlaid', {
                    url: '/password/reset/invalid',
                    templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
                }).
                state('reset-success', {
                    url: '/password/reset/success',
                    templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
                }).
                state('reset', {
                    url: '/password/reset/:token',
                    templateUrl: 'modules/users/views/password/reset-password.client.view.html'
                });
        }
    ]);

}).call(this);
