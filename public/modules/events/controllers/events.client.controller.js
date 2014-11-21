'use strict';

// Events controller
angular.module('events').controller('EventsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Events',
	function($scope, $stateParams, $location, Authentication, Events ) {
		$scope.authentication = Authentication;
		$scope.event = $scope.event || {};
		$scope.event = {
			voteEnabled:true,
			minimumVotes:0
		};

		// Google places
		$scope.options = {
			country: 'us'
		};
		$scope.details="";


		// Datepicker
		$scope.today = function() {
			$scope.event.date = new Date();
		};
		$scope.today();

		$scope.clear = function () {
			$scope.event.date = null;
		};

		// Disable weekend selection
		$scope.disabled = function(date, mode) {
			return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
		};

		$scope.toggleMin = function() {
			$scope.minDate = $scope.minDate ? null : new Date();
		};
		$scope.toggleMin();

		$scope.open = function($event) {
			$event.preventDefault();
			$event.stopPropagation();

			$scope.opened = true;
		};

		$scope.dateOptions = {
			formatYear: 'yy',
			startingDay: 1
		};

		$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
		$scope.format = $scope.formats[0];

		$scope.dateChange = function(){
			$scope.dateError = (!$scope.event.date) ? true : false;
		};


		// Timepicker
		var date = new Date();
		var plusTwoHrs = (date.getHours() + 2);
		date.setHours(plusTwoHrs);

		$scope.event.time = date;

		var now,hrsDiff, time, HRS = 2,HRS_MS = HRS * 60*60*1000;
		$scope.timeChange = function(){
			now = new Date();
			time = now.getTime();
			hrsDiff = $scope.event.time.getTime() - time;

			$scope.timeError = (hrsDiff < HRS_MS)? true: false;
		};

		// watch if places api changes
		$scope.$watch("details.geometry.location", function(newVal, oldVal){
			if(!newVal){return;}

			$scope.event.location.lat = newVal.lat();
			$scope.event.location.lng = newVal.lng();
		});

		// Create new Event
		$scope.create = function() {
			if($scope.timeError || $scope.dateError) return;

			// Create new Event object
			var event = new Events ($scope.event);

			// Redirect after save
			event.$save(function(response) {
				if(response.status === 200 && response.data){
					$location.path('events/' + response.data._id);
				} else if(response.error){
					$scope.error = response.error.clientMessage;
				} else{
					console.log("Unknown error, Status: "+response.status);
					$scope.error = "Unknown error";
				}

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Event
		$scope.remove = function( event ) {
			if ( event ) { event.$remove();

				for (var i in $scope.events ) {
					if ($scope.events [i] === event ) {
						$scope.events.splice(i, 1);
					}
				}
			} else {
				$scope.event.$remove(function() {
					$location.path('events');
				});
			}
		};

		// Update existing Event
		$scope.update = function() {
			if($scope.timeError || $scope.dateError) return;

			var event = $scope.event ;

			event.$update(function() {
				console.log("Update "+event);
				if(!event){
					$scope.error = "Error with the server";
					return;
				}
				$location.path('events/' + event._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Events
		$scope.find = function() {
			var events = Events.query(function(){
				$scope.events = events;

			});
		};

		// Find existing Event
		$scope.findOne = function() {
			var event = Events.get({
				eventId: $stateParams.eventId
			}, function(){
				$scope.event = event;
			});
		};
	}
]);
