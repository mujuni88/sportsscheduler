'use strict';

angular.module('userform').controller('UserformController', ['$scope', '$injector', 'Userform',
    function ($scope, $injector, Userform) {
        // injector
        var $validationProvider = $injector.get('$validation');

        $scope.form = {
            submit: submit
        };

        // post user data
        function submit() {
            Userform.save($scope.form)
                .$promise.then(function () {
                    alert("success");
                }, function () {
                    alert("error");
                });
        }

    }
]);