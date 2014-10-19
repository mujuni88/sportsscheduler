'use strict';
var app = angular.module('sms').factory('CarrierFactory', ['$http', '$q', 'CarrierService','LocalCarriers',
    function($http, $q, CarrierService, localCarriers) {
        
        var cs = CarrierService;
        var deferred = $q.defer();

        function success(data, status, headers, config) {
            console.log(data);
            // if success, cache it
            if (data.status === 200) {
                cs.setCarriers(data.data);
            } else if (!cs.getCarriers()) {
                // if no cache, return set local copy
                cs.setCarriers(localCarriers);
            }
            deferred.resolve(cs.getCarriers());
        }

        function error(data, status, headers, config) {
            console.log(data);
            if (!cs.getCarriers()) {
                // if no cache, return set local copy
                cs.setCarriers(localCarriers);
            }
            deferred.resolve(cs.getCarriers());
        }

        function getCarriers() {
            // get cached copy if available
            if (cs.getCarriers()) {
                deferred.resolve(cs.getCarriers());
            } else {
                $http.get('/api/carriers/countries/us').
                success(success).
                error(error);
            }
            return deferred.promise;
        }
        return {
            getCarriers: getCarriers
        };
    }
]);
app.service('CarrierService', ['$rootScope',
    function($rootScope) {
        this.cachedCarriers = null;
        this.setCarriers = function(cr) {
            this.cachedCarriers = cr;
            $rootScope.$broadcast('carrier.update');
        };
        this.getCarriers = function() {
            return this.cachedCarriers;
        };
    }
]);