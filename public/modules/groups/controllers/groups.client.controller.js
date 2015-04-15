'use strict';

// Groups controller
angular.module('groups').controller('GroupsController',GroupsController);

function GroupsController($scope, $state, $stateParams, $location, Authentication, Groups, Search, lodash, AppAlert, dialogs) {
    var _ = lodash;
    
    $scope.authentication = Authentication;
    $scope.$state = $state;

    // Create new Group
    $scope.create = create;

    // Remove existing Group
    $scope.remove = remove;

    // Update existing Group
    $scope.update = update;

    // Find a list of Groups
    $scope.find = find;

    // Find existing Group
    $scope.findOne = findOne;


    $scope.tempMembers = [];

    // Search for members
    $scope.getMembers = Search.getUsers;

    // Called when a member is selected
    $scope.onSelect = onSelect;

    // Remove member from group
    $scope.removeMember = removeMember;

    // Remove member from temporary group
    $scope.removeTempMember = removeTempMember;

    $scope.saveMember = saveMember;

    // show dialog for adding members
    $scope.addMember = addMember;


    $scope.isAdmin = isAdmin;

    function create() {
        // Create new Group object
        var group = new Groups($scope.group);

        // Redirect after save
        return group.$save(function (response) {
            $state.go('viewGroup.listMembers.viewMembers');
        });
    }

    function remove() {
        return $scope.group.$remove(function () {
            $location.path('groups');
        });
    }


    function update() {
        return $scope.group.$update(function(response){
            AppAlert.add('success','Group updated successfully');
        });
    }

    function find() {
        $scope.groups = Groups.query();
    }

    function findOne() {
        return $scope.group = Groups.get({
            groupId: $stateParams.groupId
        }, function(){
            //$scope.group.members = $scope.group.members.join($scope.group.admins);
             _.each($scope.group.members, function(item){
                if(_.include(_.pluck($scope.group.admins, '_id'), item._id)){
                    item.isAdmin = true;
                }
            });
        });
        $scope.tempMembers = [];
    }

    function onSelect($model) {
        var tM = _.isEmpty(_.include(_.pluck($scope.tempMembers, '_id'), $model._id));
        var gM = _.isEmpty(_.include(_.pluck($scope.group.members, '_id'), $model._id));
        debugger;
        if(tM && gM){
            $scope.tempMembers.push($model);
        }
    }

    function removeMember(index) {
        $scope.group.members.splice(index, 1);
        update();
    }

    function removeTempMember(index) {
        $scope.tempMembers.splice(index, 1);
    }

    function saveMember(){
        $scope.group.members = _.union($scope.group.members, $scope.tempMembers);
        _.each($scope.group.admins, function(item){
            delete item.isAdmin;
        });
        update().then(function(){
            $state.go('viewGroup.listMembers.viewMembers');        
            $scope.tempMembers = [];

        });
    }

    function isAdmin(){
        if(_.isUndefined($scope.group.admins)){
            return false;
        }
        
        var out =  _.some($scope.group.admins, {_id:$scope.authentication.user._id});
        $scope.$broadcast('isAdmin', out);
        return out;
    }

    function addMember(){
        var opts = {
            size:'sm'
        }
        dialogs.create('/modules/members/views/templ-add-member.client.view.html','MembersController',$scope.group, opts);
    }
    

}
