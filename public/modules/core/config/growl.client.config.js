(function () {
    'use strict';

// Core module config
    angular.module('core').config(config);

    function config(growlProvider){
        growlProvider.globalPosition('bottom-left');
        // growlProvider.globalDisableCloseButton(true);
        growlProvider.globalTimeToLive({success: 2000, error: 6000, warning: 6000, info: 4000});
    }
}).call(this);

