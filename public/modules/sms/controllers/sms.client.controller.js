(function(){
    'use strict';

    angular.module('sms').controller('SmsController', ['$scope', '$http', 'carriers', function ($scope, $http, carriers) {

        $scope.carriers = carriers;


        function getToAddr() {
            return $scope.smsform.phone + $scope.smsform.carrier.addr;
        }

        function getText() {
            return $scope.smsform.msg;
        }

        function sendText() {
            var to = getToAddr();
            var text = getText();
            var subject = 'Test subject';

            $scope.apiData = {to: to, text: text, subject: subject};
            $scope.sentData = $scope.apiData;

            var promise = $http.post('/api/sms', $scope.apiData);
            promise.success(function (response) {
                $scope.response = response;
            });
            promise.error(function (response) {
                alert('error ' + response);
            });

        }

        $scope.smsform = {
            submit: sendText
        };

    }
    ]);

}).call(this);
