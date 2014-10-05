'use strict';

angular.module('sms').controller('SmsController', ['$scope',
    function ($scope) {
        $scope.carriers = [
            {name: "AT&T Wireless", value: "at_and_t"},
            {name: "C Spire", value: "cellularsouth"}
        ];

        $scope.smsform = {
            submit:sendText
        }

        function sendText(){
//            alert($scope.smsform);
        }
    }
]);