(function () {
    'use strict';


    angular.module('core').controller('AppAlertController', AppAlertController);

    function AppAlertController(AppAlert) {
        var vm = this;
        vm.closeAlertIdx = AppAlert.closeAlertIdx;
        vm.closeAlert = AppAlert.closeAlert;
    }

}).call(this);
