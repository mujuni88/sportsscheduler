'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		var slides = $scope.slides = [];
		
		for (var i=0; i<4; i++) {
			addSlides();
		}

		function addSlides() {
			var newWidth = 600 + slides.length + 1;
			slides.push({
				image: 'http://placekitten.com/' + newWidth + '/300',
				text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' ' +
				['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
			});
		}
	}
]);
