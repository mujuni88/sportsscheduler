'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'mean';
	var applicationModuleVendorDependencies = [
		'ngResource', 
		'ngAnimate',
        'ngSanitize',
		'ui.router', 
		'ui.bootstrap',
		'ui.utils',
		'validation',
		'validationrule',
		'ngAutocomplete',
		'ngLodash',
		'720kb.fx',
		'xeditable',
		'dialogs.main',
		'angular-growl',
		'angularUtils.directives.dirPagination'
	];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);
		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName)
    .config(config)
    .run(run);
//Then define the init function for starting up the application
angular.element(document).ready(ready);

function config($locationProvider, paginationTemplateProvider) {
    $locationProvider.hashPrefix('!');
    paginationTemplateProvider.setPath('lib/angular-utils-pagination/dirPagination.tpl.html');
}

function run(editableOptions, editableThemes) {
    editableThemes.bs3.buttonsClass = 'btn-sm';
    editableOptions.theme = 'bs3';
}
run.$inject = ['editableOptions', 'editableThemes'];
function ready() {
    //Fixing facebook bug with redirect
    if (window.location.hash === '#_=_') window.location.hash = '#!';

    // Fixing google bug with redirect
    if (window.location.href[window.location.href.length - 1] === '#' &&
        // for just the error url (origin + /#)
        (window.location.href.length - window.location.origin.length) === 2) {
        window.location.href = window.location.origin + '/#!';
    }

    //Then init the app
    angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
}

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('articles');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('events');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('groups');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('members');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('sms');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('userform');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('validationrule');
'use strict';

// Configuring the Articles module
angular.module('articles');

'use strict';

// Setting up route
angular.module('articles').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider.
		state('listArticles', {
			url: '/articles',
			templateUrl: 'modules/articles/views/list-articles.client.view.html'
		}).
		state('createArticle', {
			url: '/articles/create',
			templateUrl: 'modules/articles/views/create-article.client.view.html'
		}).
		state('viewArticle', {
			url: '/articles/:articleId',
			templateUrl: 'modules/articles/views/view-article.client.view.html'
		}).
		state('editArticle', {
			url: '/articles/:articleId/edit',
			templateUrl: 'modules/articles/views/edit-article.client.view.html'
		});
	}
]);
'use strict';

angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles',
	function($scope, $stateParams, $location, Authentication, Articles) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var article = new Articles({
				title: this.title,
				content: this.content
			});
			article.$save(function(response) {
				$location.path('articles/' + response._id);

				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(article) {
			if (article) {
				article.$remove();

				for (var i in $scope.articles) {
					if ($scope.articles[i] === article) {
						$scope.articles.splice(i, 1);
					}
				}
			} else {
				$scope.article.$remove(function() {
					$location.path('articles');
				});
			}
		};

		$scope.update = function() {
			var article = $scope.article;

			article.$update(function() {
				$location.path('articles/' + article._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.articles = Articles.query();
		};

		$scope.findOne = function() {
			$scope.article = Articles.get({
				articleId: $stateParams.articleId
			});
		};
	}
]);
'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Articles', ['$resource',
	function($resource) {
		return $resource('articles/:articleId', {
			articleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

// Core module config
angular.module('core').config(config);

function config(growlProvider){
	growlProvider.globalPosition('bottom-left');
	// growlProvider.globalDisableCloseButton(true);
	growlProvider.globalTimeToLive({success: 2000, error: 6000, warning: 6000, info: 4000});
}

'use strict';
angular.module('core').controller('HeaderController', HeaderController);

function HeaderController($scope, $state, Authentication, Menus, Search, Users, dialogs, lodash, UserService) {
    $scope.authentication = Authentication;
    var user = Authentication.user,
    	_ = lodash;
    $scope.isCollapsed = false;
    $scope.menu = Menus.getMenu('topbar');
    $scope.title = "SportsScheduler";
    $scope.getGroups = Search.getGroups;
    $scope.onSelect = onSelect;
    $scope.toggleCollapsibleMenu = function() {
        $scope.isCollapsed = !$scope.isCollapsed;
    };
    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function() {
        $scope.isCollapsed = false;
    });

    function onSelect(group) {
        $state.go('viewGroup.listEvents.viewEvents',{
            groupId:group._id
        });
    }

}
HeaderController.$inject = ['$scope', '$state', 'Authentication', 'Menus', 'Search', 'Users', 'dialogs', 'lodash', 'UserService'];

'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication','$animate',
	function($scope, Authentication, $animate) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$animate.enabled(false);
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

'use strict';

angular.module('core').directive('dynFbCommentBox', dynFbCommentBox);

function dynFbCommentBox() {
    function createHTML(attrs) {
        return '<div class="fb-comments" ' +
            'data-href="' + attrs.href + '" ' +
            'data-numposts="' + attrs.numposts + '" ' +
            'data-colorsheme="' + attrs.colorscheme + '" ' +
            'data-width="' + attrs.width + '">' +
            '</div>';
    }

    return {
        restrict: 'A',
        scope: {},
        link: function postLink(scope, elem, attrs) {
            attrs.$observe('pageHref', function (newValue) {
                var htmlAttrs = {
                    href            : newValue,
                    numposts        : attrs.numposts    || 5,
                    colorscheme     : attrs.colorscheme || 'light',
                    width           : attrs.width || '100%'
                };

                elem.html(createHTML(htmlAttrs));
                FB.XFBML.parse(elem[0]);
            });
        }
    };
}

(function(){
    "use strict";
    /**
     * A generic confirmation for risky actions.
     * Usage: Add attributes: ng-really-message="Are you sure"? ng-really-click="takeAction()" function
     */
    angular.module('core').directive('ngReallyClick', [function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.bind('click', function() {
                    var message = attrs.ngReallyMessage;
                    if (message && confirm(message)) {
                        scope.$apply(attrs.ngReallyClick);
                    }
                });
            }
        };
    }]);
}).call(this);

'use strict';

angular.module('core').directive('ssDialog', ssDialog);

function ssDialog(dialogs) {
    var dd =  {
        scope:{
            ok:'&dialogOk',
            cancel:'&dialogCancel',
            enable:'=dialogEnable',
            config:'@dialogConfig'
        },
        restrict: 'A',
        link: postLink
    };
    return dd;

    function postLink(scope, element, attrs) {
        element.bind('click', clickFn);
        function clickFn(e) {
            if(!scope.enable){
                return;
            }

            e.preventDefault();
            launch(scope, attrs);
        }
    }
    
    function launch(scope, attrs){
        var config = angular.extend({
                size:'sm'
            }, scope.config),
        
        dlg = dialogs.confirm(attrs.title, attrs.message, config);
        
        dlg.result.then(function(btn){
            scope.ok();
            //scope.$eval(attrs.dialogOk);
        },function(btn){
            if(scope.cancel){
                scope.cancel();
            }
        });
    }
}
ssDialog.$inject = ['dialogs'];

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

angular.module('groups').factory('PaginationService', PaginationService);

function PaginationService($http) {
    function Pagination(url) {
        this.url = url || '';
    }

    Pagination.prototype = {
        getResultsPage: function (pageNumber, count) {
            return $http.get(this.url + '?page=' + pageNumber + '&count=' + count)
                .then(function (result) {
                    return result.data;
                });
        }
    };

    return Pagination;
}
PaginationService.$inject = ['$http'];

'use strict';

// Configuring the Articles module
angular.module('events');

'use strict';

//Setting up route
angular.module('events').config(['$stateProvider',
	function($stateProvider) {
		// Events state routing
		$stateProvider.
		state('listEvents', {
			url: '/events',
			templateUrl: 'modules/events/views/list-events.client.view.html'
		}).
		state('createEvent', {
			url: '/events/create',
			templateUrl: 'modules/events/views/create-event.client.view.html'
		}).
		state('viewEvent', {
			url: '/events/:eventId',
			templateUrl: 'modules/events/views/view-event.client.view.html'
		}).
		state('editEvent', {
			url: '/events/:eventId/edit',
			templateUrl: 'modules/events/views/edit-event.client.view.html'
		});
	}
]);
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
    
    var MS_PER_MINUTE = 60000;
    $scope.event = $scope.event || {
            attndNotifMins:30
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
   
    // Timepicker
    var date = new Date();
    date.setHours(date.getHours() + 1);
    $scope.event.time = date;
    $scope.attndTimeMin = 0;
    $scope.attndTimeMax = 60;

    // watch if places api changes
    $scope.$watch("details.geometry.location", watchLocation);
    $scope.$watch("event.attndNotifMins", watchEventAttndMins);
    $scope.$watch("event.time", watchEventTime);
    
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
    $scope.getTimeDiff = getTimeDiff;

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
            $scope.event.attndNotifMins < $scope.attndNotifMin ||
            $scope.event.attndNotifMins > $scope.attndNotifMax) {
            debugger;
            $scope.event.attndNotifMins = 0;
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
    
    function watchEventAttndMins(newVal, oldVal){
        if(!newVal){
            $scope.attndNotifError = true;
            newVal = 0;
        } else{
            $scope.attndNotifError = false;
        }
        $scope.attndNotifTime = new Date(Date.parse($scope.event.time)- newVal * MS_PER_MINUTE);
    }
    
    function watchEventTime(newVal, oldVal){
        $scope.attndNotifTime = new Date(Date.parse(newVal)- $scope.event.attndNotifMins * MS_PER_MINUTE);
    }
    
    
    function getTimeDiff(date, mins){
        return new Date(Date.parse(date) - mins * MS_PER_MINUTE);
    }
    
}
EventsController.$inject = ['$scope', '$state', '$stateParams', '$location', 'Authentication', 'Events', 'growl', 'lodash', '$rootScope', '$q', 'dialogs'];

'use strict';

//Events service used to communicate Events REST endpoints
angular.module('events').factory('Events', ['$resource',
	function($resource) {
		return $resource('/api/users/groups/:groupId/events/:eventId', {
			groupId: '@group._id', 
			eventId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
            query:{
                method: 'GET',
                isArray:true
            }
		});
	}
]);

'use strict';

// Configuring the Articles module
angular.module('groups').run(Menus);
function Menus(Menus) {
	// Set top bar menu items
	Menus.addMenuItem('topbar', 'Groups', 'groups', 'dropdown', '/groups(/create)?');
	Menus.addSubMenuItem('topbar', 'groups', 'List Groups', 'groups');
	Menus.addSubMenuItem('topbar', 'groups', 'New Group', 'groups/create');
}
Menus.$inject = ['Menus'];

'use strict';

//Setting up route
angular.module('groups').config(['$stateProvider',
    function ($stateProvider) {
        // Groups state routing
        $stateProvider.
            state('listGroups', {
                url: '/groups',
                templateUrl: 'modules/groups/views/list-groups.client.view.html'
            }).
            state('createGroup', {
                url: '/groups/create',
                templateUrl: 'modules/groups/views/create-group.client.view.html'
            }).
            state('viewGroup', {
                url: '/groups/:groupId',
                templateUrl: 'modules/groups/views/view-group.client.view.html'
            }).
            state('viewGroup.listMembers', {
                url: '/members',
                templateUrl: 'modules/groups/views/view-members-group.client.view.html'
            }).
            state('viewGroup.listMembers.viewMembers', {
                url: '/list',
                templateUrl: 'modules/groups/views/list-members-group.client.view.html'
            }).
            state('viewGroup.listMembers.addMembers', {
                url: '/add',
                templateUrl: 'modules/groups/views/add-members-group.client.view.html'
            }).
            state('viewGroup.listEvents', {
                url: '/events',
                templateUrl: 'modules/groups/views/view-events-group.client.view.html'
            }).
            state('viewGroup.listEvents.viewEvents', {
                url: '/list',
                templateUrl: 'modules/groups/views/list-events-group.client.view.html'
            }).
            state('viewGroup.listEvents.addEvents', {
                url: '/add',
                templateUrl: 'modules/groups/views/add-events-group.client.view.html'
            }).
            state('viewGroup.listEvents.viewEvent', {
                url: '/:eventId',
                templateUrl: 'modules/groups/views/view-event-group.client.view.html'
            }).
            state('viewGroup.listEvents.editEvent', {
                url: '/:eventId/edit',
                templateUrl: 'modules/groups/views/edit-event-group.client.view.html'
            });
    }
]);

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
    $scope.isAdmin = isAdmin;
    $scope.isOwner = isOwner;
    $scope.isLoggedInOwner = isLoggedInOwner;
    $scope.makeAdmin = makeAdmin;
    $scope.removeAdmin = removeAdmin;
    $scope.canRemoveAdmin = canRemoveAdmin;
    $scope.isMember = isMember;
    $scope.joinGroup = joinGroup;
    $scope.absUrl = $location.absUrl();

    // user functions
    $scope.getUser = getUser;
    $scope.canRevokeAdminRights = canRevokeAdminRights;
    $scope.canMakeAdmin = canMakeAdmin;
    $scope.canRemoveMember = canRemoveMember;
    $scope.canRmMember = canRmMember;
    $scope.canRmvMember = canRmvMember;
    $scope._isAdmin = _isAdmin;
    
    $scope.shareGroup = shareGroup;

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
        });
    }

    function onSelect($model) {
        if (!_isUserInTempMembers($model) && !_isUserInMembers($model)) {
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
        return update().then(function() {
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
    function isAdmin() {
        if (_.isUndefined($scope.group.admins)) {
            return false;
        }

        return _isUserInAdmins($scope.authentication.user);
    }


    function isOwner(member){
        if(_.isUndefined($scope.group.createdBy)){
            return false;
        }
        
        if(member._id !== $scope.group.createdBy._id){
            return false;
        }

        return _isUserInAdmins($scope.group.createdBy);
    }

    function isLoggedInOwner(){
        if(_.isUndefined($scope.group.createdBy)){
            return false;
        }

        return $scope.group.createdBy._id === $scope.authentication.user._id;
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

    function _addTempMember(member) {
        if (_isUserInTempMembers(member)) {
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
        growl.success(text);
    }

    function getUser(){
        var user = Users.get({
            userId: $scope.user._id
        }, function() {
            Authentication.user = user;
            $scope.user = user;
        });
        return user.$promise;
    }

    // Checks whether the logged in user is a member of the group
    function isMember(){
        return _isUserInMembers($scope.user);
    }

    function joinGroup(){
        _addMember($scope.user);
        update().then(function() {
            $state.go('viewGroup.listMembers.viewMembers');
            _notifySuccess('You are now a member');
        }, function(){
            _removeMember($scope.user);
        });
    }

    function _joinGroup(user, group){
        return UserService.joinGroupAndUser(user, group);
    }

    function canRevokeAdminRights(member){
        return ( member.isAdmin && !isOwner(member) && isLoggedInAdmin(member)) || ( member.isAdmin && isLoggedInOwner() && !isOwner(member) );
    }

    function canMakeAdmin(member){
        return member.isAdmin;
    }

    function canRemoveMember(member){
        return !member.isAdmin ||
            ( !isOwner(member) && isLoggedInAdmin(member)) ||
            ( isLoggedInOwner() && !isOwner(member) );
    }

    function canRmMember(member){
        return ( !isOwner(member) && isLoggedInOwner() );
    }

    function canRmvMember(member){
        return ( !isOwner(member) && !member.isAdmin && !isLoggedInOwner() );
    }

    function _isAdmin(member){
        return ( member.isAdmin && !isOwner(member) );
    }
    
    function isLoggedInAdmin(member){
        if(_.isUndefined($scope.authentication.user._id)){
            return false;
        }

        return member._id === $scope.authentication.user._id;
    }
    
    function shareGroup(){
        var header = 'Share Group',
            msg = ['<p>Want people to join this group?</p>',
                '<ul>',
                '<li>Share group name <br><a href="'+$location.absUrl()+'">'+$scope.group.name+'</a></li>',
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
GroupsController.$inject = ['$scope', '$state', '$stateParams', '$location', 'Authentication', 'Groups', 'Search', 'lodash', 'dialogs', '$q', 'growl', 'Users', 'UserService'];

'use strict';
angular.module('groups').factory('GroupEvents', GroupEvents);

function GroupEvents($http, $q) {
    var service = {
        create: create,
        get: get,
        update: update,
        remove: remove
    },
        url = url;
    return service;

    function create(groupId, data) {
        var request = $http({
            method: "post",
            url: url(groupId),
            data: data
        });
        return (request.then(handleSuccess, handleError));
    }

    function get(groupId, eventId) {
        var request = $http({
            method: "get",
            url: url(groupId, eventId)
        });
        return (request.then(handleSuccess, handleError));
    }

    function update(groupId, eventId, data) {
    	var request = $http({
            method: "put",
            url: url(groupId, eventId),
            data:data
        });
        return (request.then(handleSuccess, handleError));
    }

    function remove(groupId, eventId) {
        var request = $http({
            method: "delete",
            url: url(groupId, eventId)
        });
        return (request.then(handleSuccess, handleError));
    }

    function handleError(response) {
        // The API response from the server should be returned in a
        // nomralized format. However, if the request was not handled by the
        // server (or what not handles properly - ex. server error), then we
        // may have to normalize it on our end, as best we can.
        
        if (!angular.isObject(response.data) || !response.data.message) {
            return ($q.reject("An unknown error occurred."));
        }
        // Otherwise, use expected error message.
        return ($q.reject(response.data.message));
    }
    // I transform the successful response, unwrapping the application data
    // from the API response payload.
    function handleSuccess(response) {
        return (response.data);
    }

    function url(groupId, eventId) {
        groupId = groupId ? groupId : '';
        eventId = eventId ? eventId : '';
        var api = 'api/users/groups/' + groupId + '/events/' + eventId,
            reg = /\/{2,}|\/+$/g;
        return api.replace(reg, replacer);

        function replacer(match) {
            return /\/{2,}/g.test(match) ? '/' : '';
        }
    }

}
GroupEvents.$inject = ['$http', '$q'];

'use strict';

//Groups service used to communicate Groups REST endpoints
angular.module('groups').factory('Groups', ['$resource',
	function($resource) {
		return $resource('/api/users/groups/:groupId', { groupId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
            query:{method:'GET',isArray:true}
		});
	}
]);

'use strict';

angular.module('members').controller('MembersController', MembersController);

function MembersController($scope, $state, $stateParams, $location, Authentication, Groups, Search, lodash, $modalInstance, data){
    var _ = lodash;
    
    $scope.authentication = Authentication;
    $scope.$state = $state;

    $scope.group = data;
    
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

    $scope.isAdmin = isAdmin;
    
    // add members modal functions
    $scope.cancel = cancel;
    $scope.save = save;

    function create() {
        // Create new Group object
        var group = new Groups($scope.group);

        // Redirect after save
        group.$save(function (response) {
            redirectHome(group._id);
        });
    }

    function remove() {
        $scope.group.$remove(function () {
            $location.path('groups');
        });
    }


    function update() {
        $scope.group.$update(function(response){
            //redirectHome(response._id);
        });
    }

    function find() {
        $scope.groups = Groups.query();
    }

    function findOne() {
        $scope.group = Groups.get({
            groupId: $stateParams.groupId
        }, function(){
            angular.copy($scope.group.members,$scope.tempMembers);
        });

    }

    function onSelect($model) {
        var tempMembers = $scope.tempMembers;
        tempMembers.push($model);

        $scope.tempMembers = _.uniq(tempMembers, '_id');
        $scope.search.members = '';
    }

    function removeMember(index) {
        $scope.group.members.splice(index, 1);
    }

    function removeTempMember(index) {
        $scope.tempMembers.splice(index, 1);
    }

    function saveMember(){
        angular.copy($scope.tempMembers, $scope.group.members);
        update();
    }

    function redirectHome(id) {
        var _id = (id)? id: $stateParams.groupId;
        $location.path('groups/' + _id + '/members/list');
    }

    function isAdmin(){
        var out =  _.some($scope.group.admins, {_id:$scope.authentication.user._id});
        $scope.$broadcast('isAdmin', out);
        return out;
    }
    
    function cancel(){
        $modalInstance.dismiss('Canceled');
    }
    
    function save(){
        update();
        $modalInstance.close();
    }
    
}
MembersController.$inject = ['$scope', '$state', '$stateParams', '$location', 'Authentication', 'Groups', 'Search', 'lodash', '$modalInstance', 'data'];

'use strict';

//Setting up route
angular.module('sms').config(['$stateProvider',
    function ($stateProvider) {
        // Sms state routing
        $stateProvider.
            state('sms', {
                url: '/sms',
                templateUrl: 'modules/sms/views/sms.client.view.html',
                resolve: {
                    CarrierFactory: 'CarrierFactory',
                    carriers: ['CarrierFactory', function (CarrierFactory) {
                        return CarrierFactory.getCarriers();
                    }]
                },
                controller: 'SmsController'
            });
    }
]);
'use strict';

angular.module('sms').controller('SmsController', ['$scope', '$http','carriers',function ($scope, $http, carriers) {

        $scope.carriers = carriers;


        function getToAddr() {
            return $scope.smsform.phone + $scope.smsform.carrier.addr;
        }

        function getText() {
            return $scope.smsform.msg;
        }

        function sendText() {
            var to = getToAddr();
            var text = getText();
            var subject = 'Test subject';

            $scope.apiData = {to: to, text: text, subject: subject};
            $scope.sentData = $scope.apiData;

            var promise = $http.post('/api/sms', $scope.apiData);
            promise.success(function (response) {
                $scope.response = response;
            });
            promise.error(function (response) {
                alert('error ' + response);
            });

        }

        $scope.smsform = {
            submit: sendText
        };

    }
]);
'use strict';

angular.module('sms').value('LocalCarriers', [{
            "carrier": "Airfire Mobile",
            "addr": "@sms.airfiremobile.com"
        }, {
            "carrier": "Alltel",
            "addr": "@message.alltel.com"
        }, {
            "carrier": "Alltel (Allied Wireless)",
            "addr": "@sms.alltelwireless.com"
        }, {
            "carrier": "Alaska Communications",
            "addr": "@msg.acsalaska.com"
        }, {
            "carrier": "Ameritech",
            "addr": "@paging.acswireless.com"
        }, {
            "carrier": "Assurance Wireless",
            "addr": "@vmobl.com"
        }, {
            "carrier": "AT&T Wireless",
            "addr": "@txt.att.net"
        }, {
            "carrier": "AT&T Mobility (Cingular)",
            "addr": "@txt.att.net"
        }, {
            "carrier": "AT&T Enterprise Paging",
            "addr": "@page.att.net"
        }, {
            "carrier": "AT&T Global Smart Messaging Suite",
            "addr": "@sms.smartmessagingsuite.com"
        }, {
            "carrier": "BellSouth",
            "addr": "@bellsouth.cl"
        }, {
            "carrier": "Bluegrass Cellular",
            "addr": "@sms.bluecell.com"
        }, {
            "carrier": "Bluesky Communications",
            "addr": "@psms.bluesky.as"
        }, {
            "carrier": "BlueSkyFrog",
            "addr": "@blueskyfrog.com"
        }, {
            "carrier": "Boost Mobile",
            "addr": "@sms.myboostmobile.com"
        }, {
            "carrier": "Cellcom",
            "addr": "@cellcom.quiktxt.com"
        }, {
            "carrier": "Cellular South",
            "addr": "@csouth1.com"
        }, {
            "carrier": "Centennial Wireless",
            "addr": "@cwemail.com"
        }, {
            "carrier": "Chariton Valley Wireless",
            "addr": "@sms.cvalley.net"
        }, {
            "carrier": "Chat Mobility",
            "addr": "@mail.msgsender.com"
        }, {
            "carrier": "Cincinnati Bell",
            "addr": "@gocbw.com"
        }, {
            "carrier": "Cingular (Postpaid)",
            "addr": "@cingular.com"
        }, {
            "carrier": "Cleartalk Wireless",
            "addr": "@sms.cleartalk.us"
        }, {
            "carrier": "Comcast PCS",
            "addr": "@comcastpcs.textmsg.com"
        }, {
            "carrier": "Cricket",
            "addr": "@sms.mycricket.com"
        }, {
            "carrier": "C Spire Wireless",
            "addr": "@cspire1.com"
        }, {
            "carrier": "DTC Wireless",
            "addr": "@sms.advantagecell.net"
        }, {
            "carrier": "Element Mobile",
            "addr": "@sms.elementmobile.net"
        }, {
            "carrier": "Esendex",
            "addr": "@echoemail.net"
        }, {
            "carrier": "General Communications Inc.",
            "addr": "@mobile.gci.net"
        }, {
            "carrier": "Golden State Cellular",
            "addr": "@gscsms.com"
        }, {
            "carrier": "Google Voice",
            "addr": "@txt.voice.google.com"
        }, {
            "carrier": "GreatCall",
            "addr": "@vtext.com"
        }, {
            "carrier": "Helio",
            "addr": "@myhelio.com"
        }, {
            "carrier": "i wireless (T-Mobile)",
            "addr": ".iws@iwspcs.net"
        }, {
            "carrier": "i wireless (Sprint PCS)",
            "addr": "@iwirelesshometext.com"
        }, {
            "carrier": "Kajeet",
            "addr": "@mobile.kajeet.net"
        }, {
            "carrier": "LongLines",
            "addr": "@text.longlines.com"
        }, {
            "carrier": "Metro PCS",
            "addr": "@mymetropcs.com"
        }, {
            "carrier": "Nextech",
            "addr": "@sms.nextechwireless.com"
        }, {
            "carrier": "Nextel Direct Connect (Sprint)",
            "addr": "@messaging.nextel.com"
        }, {
            "carrier": "Page Plus Cellular",
            "addr": "@vtext.com"
        }, {
            "carrier": "Pioneer Cellular",
            "addr": "@zsend.com"
        }, {
            "carrier": "PSC Wireless",
            "addr": "@sms.pscel.com"
        }, {
            "carrier": "Rogers Wireless",
            "addr": "@sms.rogers.com"
        }, {
            "carrier": "Qwest",
            "addr": "@qwestmp.com"
        }, {
            "carrier": "Simple Mobile",
            "addr": "@smtext.com"
        }, {
            "carrier": "Solavei",
            "addr": "@tmomail.net"
        }, {
            "carrier": "South Central Communications",
            "addr": "@rinasms.com"
        }, {
            "carrier": "Southern Link",
            "addr": "@page.southernlinc.com"
        }, {
            "carrier": "Sprint PCS (CDMA)",
            "addr": "@messaging.sprintpcs.com"
        }, {
            "carrier": "Straight Talk",
            "addr": "@vtext.com"
        }, {
            "carrier": "Syringa Wireless",
            "addr": "@rinasms.com"
        }, {
            "carrier": "T-Mobile",
            "addr": "@tmomail.net"
        }, {
            "carrier": "Teleflip",
            "addr": "@teleflip.com"
        }, {
            "carrier": "Ting",
            "addr": "@message.ting.com"
        }, {
            "carrier": "Tracfone",
            "addr": "@mmst5.tracfone.com"
        }, {
            "carrier": "Telus Mobility",
            "addr": "@msg.telus.com"
        }, {
            "carrier": "Unicel",
            "addr": "@utext.com"
        }, {
            "carrier": "US Cellular",
            "addr": "@email.uscc.net"
        }, {
            "carrier": "USA Mobility",
            "addr": "@usamobility.net"
        }, {
            "carrier": "Verizon Wireless",
            "addr": "@vtext.com"
        }, {
            "carrier": "Viaero",
            "addr": "@viaerosms.com"
        }, {
            "carrier": "Virgin Mobile",
            "addr": "@vmobl.com"
        }, {
            "carrier": "Voyager Mobile",
            "addr": "@text.voyagermobile.com"
        }, {
            "carrier": "West Central Wireless",
            "addr": "@sms.wcc.net"
        }, {
            "carrier": "XIT Communications",
            "addr": "@sms.xit.net"
        }]);
'use strict';
var app = angular.module('sms').factory('CarrierFactory', ['$http', '$q', 'CarrierService','LocalCarriers',
    function($http, $q, CarrierService, localCarriers) {
        
        var cs = CarrierService;
        var deferred = $q.defer();

        function success(data, status, headers, config) {
            // if success, cache it
            if (data.status === 200) {
                cs.setCarriers(data.data);
            } else if (!cs.getCarriers()) {
                // if no cache, return set local copy
                cs.setCarriers(localCarriers);
            }
            deferred.resolve(cs.getCarriers());
        }

        function error(data, status, headers, config) {
            if (!cs.getCarriers()) {
                // if no cache, return set local copy
                cs.setCarriers(localCarriers);
            }
            deferred.resolve(cs.getCarriers());
        }

        function getCarriers() {
            // get cached copy if available
            if (cs.getCarriers()) {
                deferred.resolve(cs.getCarriers());
            } else {
                $http.get('/api/carriers/countries/us').
                success(success).
                error(error);
            }
            return deferred.promise;
        }
        return {
            getCarriers: getCarriers
        };
    }
]);
app.service('CarrierService', ['$rootScope',
    function($rootScope) {
        this.cachedCarriers = null;
        this.setCarriers = function(cr) {
            this.cachedCarriers = cr;
            $rootScope.$broadcast('carrier.update');
        };
        this.getCarriers = function() {
            return this.cachedCarriers;
        };
    }
]);
'use strict';

//Setting up route
angular.module('userform').config(['$stateProvider',
	function($stateProvider) {
		// Userform state routing
		$stateProvider.
		state('userform', {
			url: '/form',
			templateUrl: 'modules/userform/views/userform.client.view.html'
		});
	}
]);
'use strict';

angular.module('userform').controller('UserformController', ['$scope', 'Userform',
    function ($scope, Userform) {

        $scope.userform = {
            submit: function(){
                saveEntry();
            }
        };

        function saveEntry() {
            Userform.save($scope.userform)
                .$promise.then(function (data) {
                    $scope.message = data;

                    retrieveEntries();
                }, function (data) {
                    $scope.message = data;
                });
        }

        // retrieve all data in db
        function retrieveEntries() {
            var entries = Userform.query(function () {
                $scope.entries = entries;
            });
        }

        retrieveEntries();

    }
]);

'use strict';

angular.module('userform')
    .factory('Userform', ['$resource',
    function ($resource) {

        return $resource('/test/:userId', {
            userId: '@_id'
        }, {
            'update': {method: 'PUT'}
        });
    }
]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(config);

function config($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push('HttpProviderInterceptor');
}
config.$inject = ['$httpProvider'];

'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
    function ($stateProvider) {
        // Users state routing
        $stateProvider.
            state('settings', {
                url: '/settings/me',
                templateUrl: 'modules/users/views/settings/settings.client.view.html'
            }).
            state('settings.profile', {
                url: '/profile',
                templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
            }).
            state('settings.notifications', {
                url: '/notifications',
                templateUrl: 'modules/users/views/settings/edit-notifications.client.view.html'
            }).
            state('settings.password', {
                url: '/password',
                templateUrl: 'modules/users/views/settings/change-password.client.view.html'
            }).
            state('settings.accounts', {
                url: '/accounts',
                templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
            }).
            state('signup', {
                url: '/signup',
                templateUrl: 'modules/users/views/authentication/signup.client.view.html'
            }).
            state('signin', {
                url: '/signin',
                templateUrl: 'modules/users/views/authentication/signin.client.view.html'
            }).
            state('forgot', {
                url: '/password/forgot',
                templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
            }).
            state('reset-invlaid', {
                url: '/password/reset/invalid',
                templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
            }).
            state('reset-success', {
                url: '/password/reset/success',
                templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
            }).
            state('reset', {
                url: '/password/reset/:token',
                templateUrl: 'modules/users/views/password/reset-password.client.view.html'
            });
    }
]);

'use strict';

angular.module('users').controller('AuthenticationController', AuthenticationController);

function AuthenticationController($scope, $state, $rootScope, $http, $location, Authentication, CarrierFactory, lodash) {
	var _ = lodash;
    CarrierFactory.getCarriers().then(function(data){
        $scope.carriers = data;
    });

	$scope.authentication = Authentication;

	// If user is signed in then redirect back home
	if ($scope.authentication.user) $location.path('/');

	$scope.signup = function() {
		$scope.credentials.carrier = (_.isUndefined($scope.credentials.carrier)) ? '' : $scope.credentials.carrier.addr;

		$http.post('/api/users', $scope.credentials).success(function(response) {
			// If successful we assign the response to the global user model
			$scope.authentication.user = response;

			// And redirect to the index page
			$location.path('/');
		});
	};

	$scope.signin = function() {
		$http.post('/auth/signin', $scope.credentials).success(function(response) {
			// If successful we assign the response to the global user model
			$scope.authentication.user = response;

			// And redirect to the index page
			$location.path('/');
		});
	};

    $scope.confirmPassword = function(){
        var password = $scope.credentials.password || '';
        $scope.isPasswordError =  (password.trimRight() === $scope.credentials.confirmPassword.trimRight());
    };
}
AuthenticationController.$inject = ['$scope', '$state', '$rootScope', '$http', '$location', 'Authentication', 'CarrierFactory', 'lodash'];

'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(errorResponse) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = errorResponse.clientMessage;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(errorResponse) {
				$scope.error = errorResponse.clientMessage;
			});
		};
	}
]);

'use strict';
angular.module('users').controller('SettingsController', SettingsController);

function SettingsController($scope, $http, $state, $location, Users, Authentication, growl, $window, CarrierFactory, lodash, $validation, dialogs) {
    var _ = lodash;
    $scope.user = Authentication.user;
    $scope.authentication = Authentication;
    $scope.$state = $state;
    CarrierFactory.getCarriers().then(function(data) {
        $scope.carriers = data;
    });
    // If user is not signed in then redirect back home
    if (!$scope.user) $location.path('/');
    // Check if there are additional accounts 
    $scope.hasConnectedAdditionalSocialAccounts = hasConnectedAdditionalSocialAccounts;
    $scope.changeUserPassword = changeUserPassword;
    $scope.isConnectedSocialAccount = isConnectedSocialAccount;
    $scope.removeUserSocialAccount = removeUserSocialAccount;
    $scope.updateUserProfile = updateUserProfile;
    $scope.canText = canText;
    $scope.user.phoneNumber =  ($validation.getExpression('phone').test($scope.user.phoneNumber)) ? $scope.user.phoneNumber : null;

    function hasConnectedAdditionalSocialAccounts(provider) {
        for (var i in $scope.user.additionalProvidersData) {
            return true;
        }
        return false;
    };
    // Check if provider is already in use with current user
    function isConnectedSocialAccount(provider) {
        return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
    };
    // Remove a user social account
    function removeUserSocialAccount(provider) {
        $scope.success = $scope.error = null;
        $http.delete('/users/accounts', {
            params: {
                provider: provider
            }
        }).success(function(response) {
            // If successful show success message and clear form
            $scope.success = true;
            $scope.user = Authentication.user = response;
            _notifySuccess();
        });
    };
    // Update a user profile
    function updateUserProfile(isValid) {
        if (isValid) {
            $scope.success = $scope.error = null;
            var user = new Users($scope.user);
            user.$update(function(response) {
                $scope.success = true;
                Authentication.user = response;
                _notifySuccess();
            });
        } else {
            $scope.submitted = true;
        }
    };
    // Change user password
    function changeUserPassword() {
        $scope.success = $scope.error = null;
        $http.post('/users/password', $scope.passwordDetails).success(function(response) {
            // If successful show success message and clear form
            $scope.success = true;
            $scope.passwordDetails = null;
            _notifySuccess();
            $window.location = '/auth/signout';
        });
    };

    function _notifySuccess(text) {
        text = text || 'Settings Saved Successfully';
        growl.success(text);
    }

    function userHasPhone() {
        return $validation.getExpression('phone').test($scope.user.phoneNumber);
    }

    function userHasCarrier() {
        return !_.isUndefined($scope.user.carrier) && !_.isEmpty($scope.user.carrier);
    }

    function alertSetPhone() {
        var header = 'Text Message',
            msg = 'In order to receive text messages, make sure your phone number and carrier are correct. To verify, go to your profile settings.<br><br> Do you want to verify?',
            opts = {
                size: 'sm',
                windowClass: 'modal-btn-sm'
            };
            var dlg = dialogs.confirm(header, msg, opts);
        		dlg.result.then(function(btn){
						$state.go('settings.profile');
					});
    }

    function canText() {
        if (userHasCarrier() === true && userHasPhone() === true) {return}

        $scope.user.preferences.receiveTexts = false;
        alertSetPhone();
    }
}
SettingsController.$inject = ['$scope', '$http', '$state', '$location', 'Users', 'Authentication', 'growl', '$window', 'CarrierFactory', 'lodash', '$validation', 'dialogs'];

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [

	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

angular.module('users').factory('Authorization', Authorization);

function Authorization($rootScope, $state, authentication) {
    var service = {
        isAuf: function () {
        }
    };

    return service;
}
Authorization.$inject = ['$rootScope', '$state', 'authentication'];

(function () {
    'use strict';

// Authentication service for user variables
    angular.module('users').factory('HttpProviderInterceptor', HttpProviderInterceptor);

    function HttpProviderInterceptor($q, $location, Authentication, growl) {
        var provider =  {
            'responseError': responseError
        };
        
        return provider;
        
        function responseError(rejection) {

            switch (rejection.status) {
                case 400:
                    if(rejection.data){
                        var data = rejection.data, config = {};
                        data.clientMessage.forEach(function(msg){
                            config.title = msg;
                            growl.warning(msg);
                        });
                        data.devMessage.forEach(function(msg){
                            config.title = msg;
                            growl.warning(msg);

                        });
                    }
                    break;
                case 401:
                    // Deauthenticate the global user
                    Authentication.user = null;

                    // Redirect to signin page
                    $location.path('signin');
                    break;
                case 403:
                    // Add unauthorized behaviour 
                    break;
                case 500:
                    var config = {title:'Sorry, We are having internal server issues :('};
                    growl.warning(config.title);
                    break;
                
            }

            return $q.reject(rejection);
        }
    }
    HttpProviderInterceptor.$inject = ['$q', '$location', 'Authentication', 'growl'];
}).call(this);

'use strict';

angular.module('users').
	factory('Search', Search);

function Search($http, $q){
	var service = {
        getUsers:getUsers,
		getGroups:getGroups
	};
    
    return service;

    function getUsers(val) {
        return $http.get('/api/users/', {
            params: {
                username: val
            }
        }).then(function(response){
            if(!angular.isObject(response.data)){
                return [];
            }
            
            return response.data;
        });
    }
    function getGroups(val) {
        return $http.get('/api/users/groups/', {
            params: {
                name: val
            }
        }).then(function(response){
            if(!angular.isObject(response.data)){
                return [];
            }

            return response.data;
        });
    }
}
Search.$inject = ['$http', '$q'];

'use strict';
// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', Users);

function Users($resource) {
    return $resource('/api/users/:userId', {
        userId: '@_id'
    }, {
        update: {
            method: 'PUT'
        },
        query: {
            method: 'GET',
            isArray: true
        }
    });
}
Users.$inject = ['$resource'];

'use strict';

angular.module('users').factory('UserService', UserService);

function UserService($http){
	var service = {
		joinGroupAndUser:joinGroupAndUser
	},
	url = '/api/users/joinGroup';
	return service;

	function joinGroupAndUser(user, group){
		return $http.post(url,{user:user, group:group})
		.then(function(response){
			debugger;
			return response.data;
		});
	}

}
UserService.$inject = ['$http'];

'use strict';

angular.module('validationrule', ['validation'])
    .config(['$validationProvider', function ($validationProvider) {

        var expression = {
            required: function (value) {
                return !!value;
            },
            positiveIntegers:/^\d+$/,
            email: /^.*@.*\..*[a-z]$/i,
            phone:/(\W|^)[(]{0,1}\d{3}[)]{0,1}[\s-]{0,1}\d{3}[\s-]{0,1}\d{4}(\W|$)/,
            zip:/^\d{5}(-\d{4})?$/,
            nospecialchars:/^[a-z0-9_\-\s]*$/i,
            alpha:/^[a-z]*$/i,
            nospace:/^[^\s]+$/,
            oneUpperCaseLetter:function(value){
                return (/^(?=.*[A-Z]).+$/).test(value);
            },
            oneLowerCaseLetter:function(value){
                return (/^(?=.*[a-z]).+$/).test(value);
            },
            oneNumber:function(value){
                return (/^(?=.*[0-9]).+$/).test(value);
            },
            oneAlphabet:function(value){
                return (/^(?=.*[a-z]).+$/i).test(value);
            },
            minlength:function(value, scope, element, attrs){
                var val = value || '';
                return val.length >= parseInt(attrs.ngMinlength, 10);
            },
            maxlength:function(value, scope, element, attrs){
                var val = value || '';

                if (val.length <= parseInt(attrs.ngMaxlength, 10)) {
                    return true;
                } else {
                    return false;
                }
            }
        };

        var defaultMsg = {
            required: {
                error: 'Required!!'
            },
            positiveIntegers:{
                error:'Please enter only positive numbers with no decimals'
            },
            email: {
                error: 'Please enter a valid email'
            },
            phone: {
                error: 'Please enter a valid phone number'
            },
            zip: {
                error: 'Please enter a valid zip code'
            },
            nospecialchars:{
                error:'Valid characters are: A-Z, a-z, 0-9'
            },
            alpha:{
                error:'Valid characters are: A-Z, a-z'
            },
            nospace:{
                error:'Cannot contain any spaces'
            },
            oneUpperCaseLetter:{
                error:'Must contain at least one uppercase letter.'
            },
            oneLowerCaseLetter:{
                error:'Must contain at least one lowercase letter'
            },
            oneNumber:{
                error:'Must contain at least one number'
            },
            oneAlphabet:{
                error:'Must contain at least one alphabet'
            }
        };

        $validationProvider.setErrorHTML(function (msg) {
            return  '<div class=\'has-error\'>' + msg + '</div>';
        });
        $validationProvider.setExpression(expression).setDefaultMsg(defaultMsg);
        $validationProvider.showSuccessMessage = false;
        $validationProvider.showErrorMessage = true;



    }]);

'use strict';

angular.module('validationrule').directive('vr-match', [
	function() {
        return {
            require: 'ngModel',
                restrict: 'A',
                scope: {
                match: '='
            },
            link: function(scope, elem, attrs, ctrl) {
                scope.$watch(function() {
                    var modelValue = ctrl.$modelValue || ctrl.$$invalidModelValue;
                    return (ctrl.$pristine && angular.isUndefined(modelValue)) || scope.match === modelValue;
                }, function(currentValue) {
                    ctrl.$setValidity('match', currentValue);
                });
            }
        };
	}
]);
