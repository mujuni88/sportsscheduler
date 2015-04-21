'use strict';
// Events controller
angular.module('events').controller('EventsController', EventsController);

function EventsController($scope, $state, $stateParams, $location, Authentication, Events, growl) {
    $scope.authentication = Authentication;
    $scope.state = $state;
    $scope.stateParams = $stateParams;
    $scope.event = $scope.event || {};
    $scope.event = {
        voteEnabled: true,
        minimumVotes: 0
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
    var plusTwoHrs = (date.getHours() + 3);
    date.setHours(plusTwoHrs);
    $scope.event.time = date;
    var now, hrsDiff, time, HRS = 2,
        HRS_MS = HRS * 60 * 60 * 1000;
    $scope.timeChange = timeChange;
    // watch if places api changes
    $scope.$watch("details.geometry.location", watchLocation);
    $scope.hasEventExpired = hasEventExpired;

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

    function timeChange() {
        now = new Date();
        time = now.getTime();
        hrsDiff = $scope.event.time.getTime() - time;
        $scope.timeError = (hrsDiff < HRS_MS) ? true : false;
    };

    function hasEventExpired(eventTime) {
        var now = Date.now(),
            eD = Date.parse(eventTime);
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

    function create() {
        if ($scope.timeError || $scope.dateError) return;
        var event = new Events($scope.event),
            params = {
                groupId: $stateParams.groupId
            };
        event.group = $stateParams.groupId;
        event.$save(params, function(data) {
            $scope.event = event;
            $state.go('viewGroup.listEvents.viewEvent', {
                eventId: $scope.event._id
            });
            _notifySuccess('Event created successfully');

        });
    }

    function remove() {
        var params = {
            eventId: $stateParams.eventId
        };
        var event = Events.remove(params, function() {
            $scope.event = event;
            $state.go('viewGroup.listEvents.viewEvents');
        });
    }

    function update() {
        if ($scope.timeError || $scope.dateError) {
            return;
        };
        var params = {
            eventId: $stateParams.eventId
        };

        $scope.event.group = $stateParams.groupId;
        var event = Events.update(params,  $scope.event, function(data) {
            $scope.event = data;
            $state.go('viewGroup.listEvents.viewEvent', {
                eventId: $scope.event._id
            });

            _notifySuccess();
        });
    }

    function find() {
        $scope.events = Events.query();
    };

    function findOne() {
        var event = Events.get({
            eventId: $stateParams.eventId
        }, function() {
            $scope.event = event;
        });
    };

    function _notifySuccess(text){
        text = text || 'Event updated successfully';
        growl.success(text, {title:text});
    }
}
