'use strict';
angular.module('core').controller('HeaderController', HeaderController);

function HeaderController($scope, $state, Authentication, Menus, Search, Users, dialogs, lodash, UserService) {
    $scope.authentication = Authentication;
    var user = Authentication.user,
    	_ = lodash;
    $scope.isCollapsed = false;
    $scope.menu = Menus.getMenu('topbar');
    $scope.title = "SportsScheduler";
    $scope.getGroups = Search.getGroups;
    $scope.onSelect = onSelect;
    $scope.toggleCollapsibleMenu = function() {
        $scope.isCollapsed = !$scope.isCollapsed;
    };
    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function() {
        $scope.isCollapsed = false;
    });

    function onSelect(group) {
        $state.go('viewGroup.listEvents.viewEvents',{
            groupId:group._id
        });
    }

}
