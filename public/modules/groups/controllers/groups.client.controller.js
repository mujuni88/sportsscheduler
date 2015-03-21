'use strict';

// Groups controller
angular.module('groups').controller('GroupsController', ['$scope', '$state', '$stateParams', '$location', 'Authentication', 'Groups', 'Search', 'lodash','AppAlert',
    function ($scope, $state, $stateParams, $location, Authentication, Groups, Search, _, AppAlert) {
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


        $scope.temp = {
            members: []
        };

        // Search for members
        $scope.getMembers = Search.getUsers;

        // Called when a member is selected
        $scope.onSelect = onSelect;

        // Remove member from temporary group
        $scope.removeMember = removeMember;

        function create() {
            // Create new Group object
            var group = new Groups($scope.group);

            // Redirect after save
            group.$save(function (response) {
                redirectHome(response._id);
            });
        }

        function remove() {
            $scope.group.$remove(function () {
                $location.path('groups');
            });
        }


        function update() {
            $scope.group.$update(function(response){
                AppAlert.add('success','Group updated successfully');
                //redirectHome(response._id);
            });
        }

        function find() {
            $scope.groups = Groups.query();
        }

        function findOne() {
            $scope.group = Groups.get({
                groupId: $stateParams.groupId
            });

        }

        function onSelect($item, $model, $label) {
            var tempMembers = $scope.group.members;
            tempMembers.push($model);
            
            $scope.group.members = _.uniq(tempMembers, '_id');
        }

        function removeMember(index) {
            $scope.group.members.splice(index, 1);
        }

        function redirectHome(id) {
            $location.path('groups/' + id + '/members/list');
        }
        

    }
]);
