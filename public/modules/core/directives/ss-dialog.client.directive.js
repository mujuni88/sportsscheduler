'use strict';

angular.module('core').directive('ssDialog', ssDialog);

function ssDialog(dialogs) {
    var dd =  {
        scope:{
            ok:'&dialogOk',
            cancel:'&dialogCancel',
            enable:'@dialogEnable',
            config:'@dialogConfig'
        },
        restrict: 'A',
        link: postLink
    };
    return dd;

    function postLink(scope, element, attrs) {
        element.bind('click', function() {
            if(!scope.enable){
                return;
            }

            launch(scope, attrs); 
        });
    }
    
    function launch(scope, attrs){
        var config = angular.extend({
                size:'sm'
            }, scope.config),
        
        dlg = dialogs.confirm(attrs.title, attrs.message, config);
        
        dlg.result.then(function(btn){
            scope.ok();
        },function(btn){
            if(scope.cancel){
                scope.cancel();
            }
        });
    }
}
