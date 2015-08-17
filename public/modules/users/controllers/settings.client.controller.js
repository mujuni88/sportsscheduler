(function(){
    'use strict';
    angular.module('users').controller('SettingsController', SettingsController);

    function SettingsController($scope, $http, $state, $location, Users, Authentication, growl, $window, CarrierFactory, lodash, $validation, dialogs) {
        var _ = lodash;
        $scope.user = Authentication.user;
        $scope.authentication = Authentication;
        $scope.$state = $state;
        CarrierFactory.getCarriers().then(function (data) {
            $scope.carriers = data;
        });
        // If user is not signed in then redirect back home
        if (!$scope.user) $location.path('/');
        // Check if there are additional accounts 
        $scope.hasConnectedAdditionalSocialAccounts = hasConnectedAdditionalSocialAccounts;
        $scope.changeUserPassword = changeUserPassword;
        $scope.isConnectedSocialAccount = isConnectedSocialAccount;
        $scope.removeUserSocialAccount = removeUserSocialAccount;
        $scope.updateUserProfile = updateUserProfile;
        $scope.canText = canText;
        $scope.user.phoneNumber = ($validation.getExpression('phone').test($scope.user.phoneNumber)) ? $scope.user.phoneNumber : null;

        function hasConnectedAdditionalSocialAccounts(provider) {
            for (var i in $scope.user.additionalProvidersData) {
                return true;
            }
            return false;
        };
        // Check if provider is already in use with current user
        function isConnectedSocialAccount(provider) {
            return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
        };
        // Remove a user social account
        function removeUserSocialAccount(provider) {
            $scope.success = $scope.error = null;
            $http.delete('/users/accounts', {
                params: {
                    provider: provider
                }
            }).success(function (response) {
                // If successful show success message and clear form
                $scope.success = true;
                $scope.user = Authentication.user = response;
                _notifySuccess();
            });
        };
        // Update a user profile
        function updateUserProfile(isValid) {
            if (isValid) {
                $scope.success = $scope.error = null;
                var user = new Users($scope.user);
                user.$update(function (response) {
                    $scope.success = true;
                    Authentication.user = response;
                    _notifySuccess();
                });
            } else {
                $scope.submitted = true;
            }
        };
        // Change user password
        function changeUserPassword() {
            $scope.success = $scope.error = null;
            $http.post('/users/password', $scope.passwordDetails).success(function (response) {
                // If successful show success message and clear form
                $scope.success = true;
                $scope.passwordDetails = null;
                _notifySuccess();
                $window.location = '/auth/signout';
            });
        };

        function _notifySuccess(text) {
            text = text || 'Settings Saved Successfully';
            growl.success(text);
        }

        function userHasPhone() {
            return $validation.getExpression('phone').test($scope.user.phoneNumber);
        }

        function userHasCarrier() {
            return !_.isUndefined($scope.user.carrier) && !_.isEmpty($scope.user.carrier);
        }

        function alertSetPhone() {
            var header = 'Text Message',
                msg = 'In order to receive text messages, make sure your phone number and carrier are correct. To verify, go to your profile settings.<br><br> Do you want to verify?',
                opts = {
                    size: 'sm',
                    windowClass: 'modal-btn-sm'
                };
            var dlg = dialogs.confirm(header, msg, opts);
            dlg.result.then(function (btn) {
                $state.go('settings.profile');
            });
        }

        function canText() {
            if (userHasCarrier() === true && userHasPhone() === true) {
                return
            }

            $scope.user.preferences.receiveTexts = false;
            alertSetPhone();
        }
    }

}).call(this);
