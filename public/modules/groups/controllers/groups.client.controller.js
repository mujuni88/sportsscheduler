'use strict';
// Groups controller
angular.module('groups').controller('GroupsController', GroupsController);

function GroupsController($scope, $state, $stateParams, $location, Authentication, Groups, Search, lodash, dialogs, $q, growl) {
    var _ = lodash;
    $scope.authentication = Authentication;
    $scope.user = Authentication.user;
    if (!$scope.user) {
        $location.path('/')
    }

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
    $scope.makeAdmin = makeAdmin;
    $scope.removeAdmin = removeAdmin;
    $scope.canRemoveAdmin = canRemoveAdmin;
    // Group Functions
    function create() {
        // Create new Group object
        var group = new Groups($scope.group);
        // Redirect after save
        return group.$save(function(data) {
            $state.go('viewGroup.listMembers.viewMembers',{
                groupId:data._id
            });
            _notifySuccess('Group successfully created');
        });
    }

    function remove() {
        return $scope.group.$remove(function(data) {
            $location.path('groups');
        });
    }

    function update() {
        return $scope.group.$update();
    }

    function find() {
        $scope.groups = Groups.query();
    }
    // Member functions
    function _addIsAdminAttr() {
        _.each($scope.group.members, function(item) {
            if (_.include(_.pluck($scope.group.admins, '_id'), item._id)) {
                if (_.isUndefined(item.isAdmin)) {
                    item.isAdmin = true;
                } else {
                    item.isAdmin = false;
                }
            }
        });
    }

    function findOne() {
        return $scope.group = Groups.get({
            groupId: $stateParams.groupId
        }, function() {
            $scope.group.members = _.uniq(_.union($scope.group.members, $scope.group.admins), '_id');
            _addIsAdminAttr();
        });
        $scope.tempMembers = [];
    }

    function onSelect($model) {
        if (!_isMemberInTempMembers($model) && !_isMemberInMembers($model)) {
            $scope.tempMembers.push($model);
        } else {
            var header = 'Add Members',
                msg = '<span class="text-primary">'+$model.username + '</span> already in the group.',
                opts = {
                    size: 'sm',
                    windowClass: 'modal-btn-sm'
                };
            dialogs.notify(header, msg, opts);
        }
    }

    function removeMember(index) {
        var member = _getMember(index);
        if (member.isAdmin) {
            if (!canRemoveAdmin()) {
                _notifyCannotRemoveAdmin();
                return _getPromise(false, member);
            }

            _deleteAdminMember(member);
        }

        _deleteMember(member);
        return update().then(success, failure);

        function success() {
            _addIsAdminAttr();
            _notifySuccess('Member ' + member.username + ' removed');
        }

        function failure() {
            _addMember(member);
            _addAdmin(member);
        }
    }

    function _getMember(index) {
        return $scope.group.members[index];
    }

    function _removeMember(member) {
        _deleteMember(member);
        return update().then(success, failure);

        function success() {
            _addIsAdminAttr();
        }

        function failure() {
            _addMember(member);
        }
    }

    function removeTempMember(index) {
        $scope.tempMembers.splice(index, 1);
    }

    function saveMember() {
        $scope.group.members = _.union($scope.group.members, $scope.tempMembers);
        return update().then(function() {
            $state.go('viewGroup.listMembers.viewMembers');
            $scope.tempMembers = [];
            _addIsAdminAttr();
            _notifySuccess('Member successfully added');

        });
    }

    function addMember() {
        var opts = {
            size: 'sm'
        };
        dialogs.create('/modules/members/views/templ-add-member.client.view.html', 'MembersController', $scope.group, opts);
    }
    // Admin functions
    function isAdmin() {
        if (_.isUndefined($scope.group.admins)) {
            return false;
        }
        var out = _.some($scope.group.admins, {
            _id: $scope.authentication.user._id
        });
        $scope.$broadcast('isAdmin', out);
        return out;
    }

    function makeAdmin(member) {
        // add member to admins array
        if (!_addAdmin(member)) {
            return _getPromise(false, member);
        }
        return update().then(success, failure);
        // on succes, add isAdmin & add to member array
        function success() {
            _addIsAdminAttr();
            _notifySuccess('Admin successfully added');
        }
        // on failure, remove from admins array
        function failure() {
            _.dropRight($scope.group.admins);
        }
    }

    function removeAdmin(member) {
        if (!canRemoveAdmin()) {
            _notifyCannotRemoveAdmin();
            return _getPromise(false, member);
        }
        // remove member from admin array
        _deleteAdminMember(member);
        // update
        return update().then(success, failure);
        // on succes, add isAdmin & add to member array
        function success() {
            _addIsAdminAttr();
             _notifySuccess('Admin successfully removed');
        }
        // on failure, add member back to admins
        function failure() {
            _addAdmin(member);
        }
    }

    function canRemoveAdmin() {
        return _.size($scope.group.admins) > 1;
    }

    function _notifyCannotRemoveAdmin() {
        var header = 'Remove Admin',
            msg = 'Group requires an admin. Assign admin rights to a member in order to remove one',
            opts = {
                size: 'sm',
                windowClass: 'modal-btn-sm'
            };
        dialogs.notify(header, msg, opts);
    }

    function _addAdmin(member) {
        if (_isMemberInAdmins(member)) {
            return false;
        }
        $scope.group.admins.push(member);
        return true;
    }

    function _addMember(member) {
        if (_isMemberInMembers(member)) {
            return false;
        }
        $scope.group.members.push(member);
        return true;
    }

    function _addTempMember(member) {
        if (_isMemberInTempMembers(member)) {
            return false;
        }
        $scope.tempMembers.push(member);
        return true;
    }

    function _deleteAdminMember(member) {
        $scope.group.admins = _.reject($scope.group.admins, function(item) {
            return _.isEqual(item._id, member._id);
        });
    }

    function _deleteMember(member) {
        $scope.group.members = _.reject($scope.group.members, function(item) {
            return _.isEqual(item._id, member._id);
        });
    }

    function _isMemberInTempMembers(member) {
        return _.include(_.pluck($scope.tempMembers, '_id'), member._id);
    }

    function _isMemberInAdmins(member) {
        return _.includes(_.pluck($scope.group.admins, '_id'), member._id);
    }

    function _isMemberInMembers(member) {
        return _.include(_.pluck($scope.group.members, '_id'), member._id);
    }

    function _getPromise(isSuccess, data) {
        var deferred = $q.defer();
        setTimeout(function() {
            if (isSuccess) {
                deferred.resolve(data);
            } else {
                deferred.reject(data);
            }
        }, 1);
        return deferred.promise;
    }

    function _notifySuccess(text){
        text = text || 'Group successfully updated';
        growl.success(text, {title:text});
    }
}
