'use strict';


angular.module('core').controller('ErrorController', ['$rootScope','lodash', ErrorController]);

function ErrorController($rootScope, _) {

    $rootScope.$on('$stateChangeStart', onRouteChange);
    $rootScope.$watch('error', watchError);
    $rootScope.closeAlert = closeAlert;

    function onRouteChange(){
        if(isErrorUnDef()){return;}
        $rootScope.errors = [];
    }
    
    function watchError(){
        if(isErrorUnDef()){return;}
        $rootScope.errors = $rootScope.error.clientMessage.concat($rootScope.error.devMessage);
    }
    
    function isErrorUnDef(){
       return _.isUndefined($rootScope.error); 
    }
    
    function closeAlert(index){
        $rootScope.errors.splice(index, 1);
    }
}
