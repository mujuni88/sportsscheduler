(function(){
    'use strict';

//Setting up route
    angular.module('sms').config(['$stateProvider',
        function ($stateProvider) {
            // Sms state routing
            $stateProvider.
                state('sms', {
                    url: '/sms',
                    templateUrl: 'modules/sms/views/sms.client.view.html',
                    resolve: {
                        CarrierFactory: 'CarrierFactory',
                        carriers: function (CarrierFactory) {
                            return CarrierFactory.getCarriers();
                        }
                    },
                    controller: 'SmsController'
                });
        }
    ]);

}).call(this);
