'use strict';

angular.module('sms').controller('SmsController', ['$scope','$http',
    function ($scope, $http) {
        $scope.carriers = [
            {name: 'AT&T Wireless', value:'@txt.att.net'},
            {name: 'C Spire', value:'@csouth1.com'}
        ];

        function getToAddr(){
            return $scope.smsform.phone+$scope.smsform.carrier.value;
        }

        function getText(){
            return $scope.smsform.msg;
        }

        function sendText(){
            var to = getToAddr();
            var text = getText();
            var subject = 'Test subject';

            $scope.apiData = {to:to, text:text, subject:subject};
            $scope.sentData = $scope.apiData;

            var promise = $http.post('/api/sms',$scope.apiData);
            promise.success(function(response){
                $scope.response = response;
            });
            promise.error(function(response){
                alert('error '+response);
            });

        }        

        $scope.smsform = {
            submit:sendText
        };

    }
]);