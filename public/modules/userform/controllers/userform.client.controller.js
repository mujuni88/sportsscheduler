'use strict';

angular.module('userform').controller('UserformController', ['$scope', 'Userform',
    function ($scope, Userform) {

        retrieveEntries();

        $scope.form = {
            submit: function(){
                saveEntry();
            }
        };

        function saveEntry() {
            Userform.save($scope.form)
                .$promise.then(function (data) {
                    $scope.message = data;

                    retrieveEntries();
                }, function (data) {
                    $scope.message = data;
                });
        }

        // retrieve all data in db
        function retrieveEntries() {
            var entries = Userform.query(function () {
                $scope.entries = entries;
            });
        }

    }
]);