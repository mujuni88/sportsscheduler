'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication','CarrierFactory',
	function($scope, $http, $location, Authentication, CarrierFactory) {

        CarrierFactory.getCarriers().then(function(data){
            $scope.carriers = data;
        });

		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

        $scope.isPasswordError = true;
        $scope.confirmPassword = function(){
            var password = $scope.credentials.password || '';
            $scope.isPasswordError =  (password.trimRight() === $scope.credentials.confirmPassword.trimRight());
        };
	}
]);