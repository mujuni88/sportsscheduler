'use strict';


angular.module('core').controller('ErrorController', ['$rootScope','lodash', ErrorController]);

function ErrorController($rootScope, _) {
    $rootScope.$watch('error', function(){
        if(_.isUndefined($rootScope.error)){return;}
        $rootScope.errors = $rootScope.error.clientMessage.concat($rootScope.error.devMessage);
    });
    
    $rootScope.closeAlert = closeAlert;
    
    function closeAlert(index){
        $rootScope.errors.splice(index, 1);
    }
}
