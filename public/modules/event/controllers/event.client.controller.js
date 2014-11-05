'use strict';

angular.module('event').controller('EventController', ['$scope','Event',
	function($scope, Event) {

		function saveEntry() {
			Event.save($scope.eventform)
				.$promise.then(function (data) {
					$scope.message = data;

					retrieveEntries();
				}, function (data) {
					$scope.message = data;
				});
		}

		// retrieve all data in db
		function retrieveEntries() {
			var entries = Event.query(function () {
				$scope.entries = entries;
			});
		}

		$scope.eventform = {
			submit: function(){
				alert('hello');
				saveEntry();
			}
		};
		retrieveEntries();
	}
]);
