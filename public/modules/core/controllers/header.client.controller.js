'use strict';
angular.module('core').controller('HeaderController', HeaderController);

function HeaderController($scope, $state, Authentication, Menus, Search, Users, dialogs, lodash) {
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
        if(!canUserJoinGroup(group)){
        	_notifyUser(group);
        	return;
        }

        addGroupToUser(group).then(function(data){
        	Authentication.user = data;
    		$state.go('viewGroup.listMembers.viewMembers',{
                groupId:group._id
            });
        }, function(data){

        });
    }

    function addGroupToUser(group) {
        user.joinedGroups.push(group);
        var ret = Users.save({userId:user._id}, user, function(data){
        	return data;
        });

        return ret.$promise;
    }

    function canUserJoinGroup(group) {
        return (!_hasUserJoinedGroup(group) && !(_hasUserCreatedGroup(group)));
    }

    function _hasUserJoinedGroup(group) {
        return _.include(_.pluck(user.joinedGroup, '_id'), group._id);
    }

    function _hasUserCreatedGroup(group) {
        return _.include(_.pluck(user.createdGroup, '_id'), group._id);
    }

    function _notifyUser(group) {
        var header = 'Join Group',
            msg = 'You have already joined <span class="text-primary">' + group.name + '</span>.',
            opts = {
                size: 'sm',
                windowClass: 'modal-btn-sm'
            };
        dialogs.notify(header, msg, opts);
    }
}
