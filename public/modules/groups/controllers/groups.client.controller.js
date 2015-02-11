'use strict';

// Groups controller
angular.module('groups').controller('GroupsController', ['$scope', '$state', '$stateParams', '$location', 'Authentication', 'Groups','Search','lodash',
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

        function create() {
            // Create new Group object
            var group = new Groups($scope.group);

            // Redirect after save
            group.$save(function (response) {
                if (response.status === 200 && response.data) {
                    $location.path('groups/' + response.data._id);
                } else if (response.error) {
                    $scope.error = response.error.clientMessage;
                } else {
                    console.log("Unknown error, Status: " + response.status);
                    $scope.error = "Unknown error";
                }

                $scope.name = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        }
        
        function remove(group) {
            if (group) {
                group.$remove();

                for (var i in $scope.groups) {
                    if ($scope.groups [i] === group) {
                        $scope.groups.splice(i, 1);
                    }
                }
            } else {
                $scope.group.$remove(function () {
                    $location.path('groups');
                });
            }
        }
        
        
        
        function update() {
            var group = $scope.group;
            console.log(group);
            group.$update(function () {
                $location.path('groups/' + group._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        }
        
        function find() {
            var groups = Groups.query(function () {
                $scope.groups = groups.data;
            });
        }
        function findOne() {
            $scope.group = Groups.get({
                groupId: $stateParams.groupId
            }, function(){
                $scope.members = $scope.group.members;
            });
            
        }
        
        function onSelect($item, $model, $label){
            var tempMembers = $scope.members;
            tempMembers.push($model);
            
            $scope.members = _.uniq(tempMembers, 'username');
        }
        
        function saveMembers(){
            var union = _.union($scope.group.members, $scope.members);
            var uniq = _.uniq(union,'_id');
            var ids = _.pluck(uniq, "_id");
            
            $scope.group.members = ids;
            update();
        }
        
        function removeMember(index, id){
            $scope.members.splice(index,1);
        }
        
    }
]);
