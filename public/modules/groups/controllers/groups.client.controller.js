'use strict';

// Groups controller
angular.module('groups').controller('GroupsController', ['$scope', '$state', '$stateParams', '$location', 'Authentication', 'Groups', 'Search', 'lodash',
    function ($scope, $state, $stateParams, $location, Authentication, Groups, Search, _) {
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

        // Save members to their group
        $scope.saveMembers = saveMembers;

        // Remove member from temporary group
        $scope.removeMember = removeMember;

        // Close alert
        $scope.closeAlert = closeAlert;

        function create() {
            // Create new Group object
            var group = new Groups($scope.group);

            // Redirect after save
            group.$save(function (response) {
                redirectHome(response._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.clientMessage;
            });
        }

        function remove() {
            $scope.group.$remove(function () {
                $location.path('groups');
            });
        }


        function update() {
            $scope.group.$update(function(response){
                redirectHome(response._id);
            }, function(errorResponse){
                $scope.error = errorResponse.data.clientMessage;
            });
        }

        function find() {
            $scope.groups = Groups.query(function(response) {
            },function(errorResponse){
                $scope.error = errorResponse.clientMessage;
            });
        }

        function findOne() {
            $scope.group = Groups.get({
                groupId: $stateParams.groupId
            }, function () {
                $scope.members = $scope.group.members;
            }, function(errorResponse){
                $scope.error = errorResponse.clientMessage;
            });

        }

        function onSelect($item, $model, $label) {
            var tempMembers = $scope.members;
            tempMembers.push($model);

            $scope.members = _.uniq(tempMembers, 'username');
        }

        function saveMembers() {
            var union = _.union($scope.group.members, $scope.members),
                uniq = _.uniq(union, '_id'),
                ids = _.pluck(uniq, "_id");

            $scope.group.members = uniq;
            update();
        }

        function removeMember(index) {
            $scope.members.splice(index, 1);
        }

        function redirectHome(id) {
            $location.path('groups/' + id + '/members/list');
        }

        function closeAlert(index){
           $scope.error.splice(index, 1); 
        }

    }
]);
