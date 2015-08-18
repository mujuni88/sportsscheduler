(function () {


    'use strict';
// Groups controller
    angular.module('groups').controller('GroupsController', GroupsController);

    function GroupsController($scope, $state, $stateParams, $location, Authentication, Groups, Search, lodash, dialogs, $q, growl, Users, UserService) {
        var _ = lodash;
        $scope.authentication = Authentication;
        $scope.user = $scope.authentication.user;
        if (!$scope.user) {
            $location.path('/');
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
        $scope.isLoggedInAdmin = isLoggedInAdmin;
        $scope.isOwner = isOwner;
        $scope.isLoggedInOwner = isLoggedInOwner;
        $scope.makeAdmin = makeAdmin;
        $scope.removeAdmin = removeAdmin;
        $scope.canRemoveAdmin = canRemoveAdmin;
        $scope.isLoggedInUserAMember = isLoggedInUserAMember;
        $scope.joinGroup = joinGroup;
        $scope.absUrl = $location.absUrl();

        // user functions
        $scope.getUser = getUser;
        $scope.canRevokeAdminRights = canRevokeAdminRights;
        $scope.canMakeAdmin = canMakeAdmin;
        $scope.canRemoveMember = canRemoveMember;
        $scope.isAdmin = isAdmin;

        $scope.shareGroup = shareGroup;

        // Group Functions
        function create() {
            // Create new Group object
            var group = new Groups($scope.group);
            // Redirect after save
            return group.$save(function (data) {
                $state.go('viewGroup.listMembers.viewMembers', {
                    groupId: data._id
                });
                _notifySuccess('Group successfully created');
            });
        }

        function remove() {
            return $scope.group.$remove(function (data) {
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
        function findOne() {
            return $scope.group = Groups.get({
                groupId: $stateParams.groupId
            });
        }

        function onSelect($model) {
            if (!_isUserInTempMembers($model) && !_isUserInMembers($model)) {
                $scope.tempMembers.push($model);
            } else {
                var header = 'Add Members',
                    msg = '<span class="text-primary">' + $model.username + '</span> already in the group.',
                    opts = {
                        size: 'sm',
                        windowClass: 'modal-btn-sm'
                    };
                dialogs.notify(header, msg, opts);
            }
        }

        function removeMember(member) {
            // var member = _getMember(index);
            if (member.isAdmin) {
                if (!canRemoveAdmin()) {
                    _notifyCannotRemoveOwner();
                    return _getPromise(false, member);
                }

                _deleteAdminMember(member);
            }

            _deleteMember(member);
            return update().then(success, failure);

            function success() {
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
            return update().then(function () {
                $state.go('viewGroup.listMembers.viewMembers');
                $scope.tempMembers = [];
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
        function isOwner(member) {
            if (_.isUndefined($scope.group.createdBy)) {
                return false;
            }

            if (member._id !== $scope.group.createdBy._id) {
                return false;
            }

            return _isUserInAdmins($scope.group.createdBy);
        }

        function isLoggedInOwner() {
            if (_.isUndefined($scope.group.createdBy)) {
                return false;
            }

            return $scope.group.createdBy._id === $scope.authentication.user._id;
        }

        function isLoggedInAdmin() {
            if (_.isUndefined($scope.group.admins)) {
                return false;
            }

            return _isUserInAdmins($scope.authentication.user);
        }

        function _isLoggedInMember(member) {
            if (_.isUndefined($scope.authentication.user._id)) {
                return false;
            }

            return member._id === $scope.authentication.user._id;
        }

        function makeAdmin(member) {
            // add member to admins array
            if (!_addAdmin(member)) {
                return _getPromise(false, member);
            }
            return update().then(success, failure);
            // on succes, add isAdmin & add to member array
            function success() {
                _notifySuccess('Admin successfully added');
            }

            // on failure, remove from admins array
            function failure() {
                _.dropRight($scope.group.admins);
            }
        }

        function removeAdmin(member) {
            if (isOwner(member)) {
                _notifyCannotRemoveOwner();
                return _getPromise(false, member);
            }
            // remove member from admin array
            _deleteAdminMember(member);
            // update
            return update().then(success, failure);
            // on succes, add isAdmin & add to member array
            function success() {
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

        function _notifyCannotRemoveOwner() {
            var header = 'Remove Owner',
                msg = 'Can not remove the owner',
                opts = {
                    size: 'sm',
                    windowClass: 'modal-btn-sm'
                };
            dialogs.notify(header, msg, opts);
        }

        function _addAdmin(member) {
            if (_isUserInAdmins(member)) {
                return false;
            }
            $scope.group.admins.push(member);
            return true;
        }

        function _addMember(member) {
            if (_isUserInMembers(member)) {
                return false;
            }
            $scope.group.members.push(member);
            return true;
        }
        

        function _deleteAdminMember(member) {
            $scope.group.admins = _.reject($scope.group.admins, function (item) {
                return _.isEqual(item._id, member._id);
            });
        }

        function _deleteMember(member) {
            $scope.group.members = _.reject($scope.group.members, function (item) {
                return _.isEqual(item._id, member._id);
            });
        }

        function _isUserInTempMembers(user) {
            return _.include(_.pluck($scope.tempMembers, '_id'), user._id);
        }

        function _isUserInAdmins(user) {
            return _.includes(_.pluck($scope.group.admins, '_id'), user._id);
        }

        function _isUserInMembers(user) {
            return _.include(_.pluck($scope.group.members, '_id'), user._id);
        }

        function _getPromise(isSuccess, data) {
            var deferred = $q.defer();
            setTimeout(function () {
                if (isSuccess) {
                    deferred.resolve(data);
                } else {
                    deferred.reject(data);
                }
            }, 1);
            return deferred.promise;
        }

        function _notifySuccess(text) {
            text = text || 'Group successfully updated';
            growl.success(text);
        }

        function getUser() {
            var user = Users.get({
                userId: $scope.user._id
            }, function () {
                Authentication.user = user;
                $scope.user = user;
            });
            return user.$promise;
        }

        // Checks whether the logged in user is a member of the group
        function isLoggedInUserAMember() {
            return _isUserInMembers($scope.user);
        }

        function joinGroup() {
            _addMember($scope.user);
            update().then(function () {
                $state.go('viewGroup.listMembers.viewMembers');
                _notifySuccess('You are now a member');
            }, function () {
                _removeMember($scope.user);
            });
        }

        function _joinGroup(user, group) {
            return UserService.joinGroupAndUser(user, group);
        }

        function canRevokeAdminRights(member) {
            return ( member.isAdmin && !isOwner(member) && _isLoggedInMember(member)) || ( member.isAdmin && isLoggedInOwner() && !isOwner(member) );
        }

        function canMakeAdmin(member) {
                        if(_.isUndefined(member)) {return false};

            return member.isAdmin;
        }

        function canRemoveMember(member) {
            return (!member.isAdmin && _isLoggedInMember(member)) || // member removing themselves
                (!member.isAdmin && isLoggedInAdmin()) || // admin removing any members
                ( !isOwner(member) && _isLoggedInMember(member) && isLoggedInAdmin()) || // admin
                ( isLoggedInOwner() && !isOwner(member) ); // owner
        }

        function isAdmin(member) {
            if(_.isUndefined(member)) {return false};

            return ( member.isAdmin && !isOwner(member) );
        }

        function shareGroup() {
            var header = 'Share Group',
                msg = ['<p>Want people to join this group?</p>',
                    '<ul>',
                    '<li>Share group name <br><a href="' + $location.absUrl() + '">' + $scope.group.name + '</a></li>',
                    '<li>Search for the group</li>',
                    '<li>Click Join Group</li>',
                    '</ul>'].join(' '),
                opts = {
                    size: 'sm',
                    windowClass: 'modal-btn-sm'
                };
            dialogs.notify(header, msg, opts);
        }
    }
}).call(this);
