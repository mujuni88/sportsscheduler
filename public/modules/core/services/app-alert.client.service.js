(function () {

    "use strict";

    angular.module('core')
        .factory('AppAlert', AppAlert);


    function AppAlert($rootScope, $timeout) {
        $rootScope.alerts = [];
        $rootScope.$on('$stateChangeStart', onRouteChange);
        var alertService = {
                add: add,
                closeAlert: closeAlert,
                closeAlertIdx: closeAlertIdx,
                clear: clear
            };

        return alertService;

        ////////////

        function onRouteChange() {
            clear();
        }

        function add(type, msg, timeout) {
            $rootScope.alerts.push({
                type: type,
                msg: msg,
                close: function () {
                    return alertService.closeAlert(this);
                }
            });

            if (timeout) {
                $timeout(function () {
                    clear();
                }, timeout);
            }
        }

        function closeAlert(alert) {
            return this.closeAlertIdx($rootScope.alerts.indexOf(alert));
        }

        function closeAlertIdx(index) {
            return $rootScope.alerts.splice(index, 1);
        }

        function clear() {
            $rootScope.alerts = [];
        }

    }
}).call(this);

