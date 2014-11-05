'use strict';

angular.module('group').controller('GroupController', ['$scope','Group',
	function($scope, Group) {

		function saveEntry() {
			Group.save($scope.groupform)
				.$promise.then(function (data) {
					$scope.message = data;

					retrieveEntries();
				}, function (data) {
					$scope.message = data;
				});
		}

		// retrieve all data in db
		function retrieveEntries() {
			var entries = Group.query(function () {
				$scope.entries = entries;
			});
		}

		$scope.groupform = {
			submit: function(){
				alert('hello');
				saveEntry();
			}
		};
		retrieveEntries();
	}
]);
