'use strict';
// Events controller
angular.module('events').controller('EventsController', EventsController);

function EventsController($scope, $state, $stateParams, $location, Authentication, Events, growl, lodash, $rootScope,$q, dialogs) {
    var _ = lodash;
    _.mixin({
        rejectList: rejectList
    });
    $scope.authentication = Authentication;
    $scope.user = Authentication.user;
    if (!$scope.user) {
        $location.path('/');
    }
    $scope.state = $state;
    $scope.stateParams = $stateParams;
    $scope.event = $scope.event || {
            attndNotifMins:30,
            minimumVotes:0
        };
    // Create new Event
    $scope.create = create;
    // Remove existing Event
    $scope.remove = remove;
    // Update existing Event
    $scope.update = update;
    // Find a list of Events
    $scope.find = find;
    // Find existing Event
    $scope.findOne = findOne;
    // Google places
    $scope.options = {
        country: 'us'
    };
    $scope.details = "";
    // Datepicker
    $scope.today = getDate;
    $scope.today();
    $scope.clear = clearDate;
    // Disable weekend selection
    $scope.disabled = disableDate;
    $scope.toggleMin = toggleMin;
    $scope.toggleMin();
    $scope.open = openDate;
    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.dateChange = dateChange;
   
    // Timepicker
    var date = new Date();
    date.setHours(date.getHours() + 1);
    $scope.event.time = date;
   
    // watch if places api changes
    $scope.$watch("details.geometry.location", watchLocation);
    
    $scope.$on('voted', watchVotes);
    $scope.hasEventExpired = hasEventExpired;
    $scope.voteYes = voteYes;
    $scope.voteNo = voteNo;
    $scope.hasVotedYes = hasVotedYes;
    $scope.hasVotedNo = hasVotedNo;
    $scope.group = $scope.$parent.group;
    var findOneGroup = $scope.$parent.findOne;

    // pagination
    $scope.pagination = {
        current: 1,
        totalEvents: 0,
        eventsPerPage:1
    };

    $scope.canCreateEvent = canCreateEvent;
    var MAX_EVENTS = 5;
    $scope.MAX_EVENTS =  MAX_EVENTS;

    function getDate() {
        $scope.event.date = new Date();
    }

    function clearDate() {
        $scope.event.date = null;
    }

    function disableDate(date, mode) {
        return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
    }

    function toggleMin() {
        $scope.minDate = $scope.minDate ? null : new Date();
    }

    function openDate($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    }

    function dateChange() {
        $scope.dateError = (!$scope.event.date) ? true : false;
    }

    function hasEventExpired(eventTime) {
        var now = Date.now(),
            eD = Date.parse(eventTime),
            hrsDiff;
        
        hrsDiff = eD - now;
        return (hrsDiff < 0) ? true : false;
    }

    function watchLocation(newVal, oldVal) {
        if (!newVal) {
            return;
        }
        $scope.event.location.lat = newVal.lat();
        $scope.event.location.lng = newVal.lng();
    }

    function watchVotes(data) {
        $scope.unrespUsers = getUnresponsiveUsers();
    }

    function create() {
        if(!_canCreateEvent()){
            _notifyEventMax();
            return;
        }        
        if (_.isUndefined($scope.event.attndNotifMins) ||
            _.isNaN($scope.event.attndNotifMins) ||
            $scope.event.attndNotifMins < 5 ||
            $scope.event.attndNotifMins > 60) {
            $scope.event.attndNotifMins = 30;
        }
        
        var event = new Events($scope.event),
            params = {
                groupId: $stateParams.groupId
            };
        event.group = $stateParams.groupId;
        event.$save(params, function (data) {
            $scope.event = event;
            _refreshData();
            $state.go('viewGroup.listEvents.viewEvent', {
                eventId: $scope.event._id
            });
            _notifySuccess('Event created successfully');
        });
        return event.$promise;
    }

    function remove() {
        var params = {
            eventId: $stateParams.eventId
        };
        var event = Events.remove(params, function () {
            $scope.event = event;
            _refreshData();
            $state.go('viewGroup.listEvents.viewEvents');
            _notifySuccess('Event successfully removed');
        });
        return event.$promise;
    }

    function update() {
        var params = {
            eventId: $stateParams.eventId
        };
        $scope.event.group = $stateParams.groupId;
        var event = Events.update(params, $scope.event, function (data) {
            $scope.event = data;
            _refreshData();
            $state.go('viewGroup.listEvents.viewEvent', {
                eventId: $scope.event._id
            });
        });
        return event.$promise;
    }

    function find() {
        $scope.events = Events.query({
            groupId: $stateParams.groupId
        });
    }

    function findOne() {
        var event = Events.get({
            eventId: $stateParams.eventId
        }, function () {
            $scope.event = event;
            $scope.unrespUsers = getUnresponsiveUsers();
        });
        return event.$promise;
    }

    function _notifySuccess(text) {
        text = text || 'Event updated successfully';
        growl.success(text);
    }

    function voteYes() {
        _addUserToVoteYes($scope.user);
        update().then(success, failure).finally(final);

        function success(data) {
            _notifySuccess('Voted successfully');
        }

        function failure(data) {
            _deleteUserFromYes($scope.user);

            // only add to yes, if they were previously there
            _addUserToVoteNo($scope.user);
        }

        function final(data) {
            $rootScope.$broadcast('voted', data);
        }
    }

    function voteNo() {
        _addUserToVoteNo($scope.user);
        update().then(success, failure).finally(final);

        function success(data) {
            _notifySuccess('Voted successfully');
        }

        function failure(data) {
            _deleteUserFromNo($scope.user);

            // only add to yes, if they were previously there
            _addUserToVoteYes($scope.user);
        }

        function final(data) {
            $rootScope.$broadcast('voted', data);
        }
    }

    function _addUserToVoteYes(user) {
        user = user || $scope.user;
        if (_hasUserVotedNo(user)) {
            _deleteUserFromNo(user);
        }
        if (!_hasUserVotedYes(user)) {
            $scope.event.attendance.yes.push(user);
        }
    }

    function _addUserToVoteNo(user) {
        user = user || $scope.user;
        if (_hasUserVotedYes(user)) {
            _deleteUserFromYes(user);
        }
        if (!_hasUserVotedNo(user)) {
            $scope.event.attendance.no.push(user);
        }
    }

    function _deleteUserFromYes(user) {
        user = user || $scope.user;
        $scope.event.attendance.yes = _.reject($scope.event.attendance.yes, function (item) {
            return _.isEqual(item._id, user._id);
        });
    }

    function _deleteUserFromNo(user) {
        user = user || $scope.user;
        $scope.event.attendance.no = _.reject($scope.event.attendance.no, function (item) {
            return _.isEqual(item._id, user._id);
        });
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

    function hasVotedYes(user) {
        return _hasUserVotedYes(user);
    }

    function hasVotedNo(user) {
        return _hasUserVotedNo(user);
    }

    function _hasUserVotedYes(user) {
        user = user || $scope.user;
        if (_.isUndefined($scope.event.attendance)) {
            return false;
        }
        return _.include(_.pluck($scope.event.attendance.yes, '_id'), user._id);
    }

    function _hasUserVotedNo(user) {
        user = user || $scope.user;
        if (_.isUndefined($scope.event.attendance)) {
            return false;
        }
        return _.include(_.pluck($scope.event.attendance.no, '_id'), user._id);
    }

    function rejectList(list, rej, key) {
        rej.forEach(function (item) {
            list = _(list).reject(function (it) {
                return item[key] === it[key];
            }).value();
        });
        return list;
    }

    function getUnresponsiveUsers(members) {
        members = members || $scope.group.members;
        return _(members)
            .rejectList($scope.event.attendance.no, '_id')
            .rejectList($scope.event.attendance.yes, '_id')
            .value();
    }
    
    function canCreateEvent(){
        if(!_canCreateEvent()){
            _notifyEventMax();
            return;
        }

        $state.go('viewGroup.listEvents.addEvents',{
            groupId:$stateParams.groupId
        });
    }
    
    function _canCreateEvent(){
        if(!_.isUndefined($scope.events)){
            return ($scope.events.length < MAX_EVENTS);
        }
        
        if(_.isUndefined($scope.group.events.length)){
            growl.warning("Internal error :(");
            return false;
        }
        
        return ($scope.group.events.length < MAX_EVENTS);
    }
    
    function _notifyEventMax(){
        var header = 'Add Event',
            msg = 'You have reached the maximum number(5) of events allowed. Please delete one to continue.',
            opts = {
                size: 'sm',
                windowClass: 'modal-btn-sm'
            };
        dialogs.notify(header, msg, opts);
    }
    
    function _refreshData(){
        find();
        findOneGroup();
    }
    
}
