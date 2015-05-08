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
		'angular-growl'
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
    .config(['$locationProvider',config])
    .run(['editableOptions','editableThemes', run]);
//Then define the init function for starting up the application
angular.element(document).ready(ready);

function config($locationProvider) {
    $locationProvider.hashPrefix('!');
}

function run(editableOptions, editableThemes) {
    editableThemes.bs3.buttonsClass = 'btn-sm';
    editableOptions.theme = 'bs3';
}
function ready() {
    //Fixing facebook bug with redirect
    if (window.location.hash === '#_=_') window.location.hash = '#!';

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
angular.module('articles').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Articles', 'articles', 'dropdown', '/articles(/create)?');
		Menus.addSubMenuItem('topbar', 'articles', 'List Articles', 'articles');
		Menus.addSubMenuItem('topbar', 'articles', 'New Article', 'articles/create');
	}
]);
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
	growlProvider.globalPosition('top-center');
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
        if(!canUserJoinGroup(group)){
        	_notifyUser(group);
        	return;
        }

        _joinGroupAndUser(group);
    }

    function addGroupToUser(group) {
        user.joinedGroups.push(group);
        var ret = Users.save({userId:user._id}, user, function(data){
            return data;
        });

        return ret.$promise;
    }
    function _joinGroupAndUser(group) {

        user.joinedGroups.push(group);
        return UserService.joinGroupAndUser(user, group).then(function(response){
            Authentication.user = response.data;
            $state.go('viewGroup.listMembers.viewMembers',{
                groupId:group._id
            });
        }, function(response){debugger;});
    }

    function canUserJoinGroup(group) {
        return (!_hasUserJoinedGroup(group) && !(_hasUserCreatedGroup(group)));
    }

    function _hasUserJoinedGroup(group) {
        return _.include(_.pluck(user.joinedGroup, '_id'), group._id);
    }

    function _hasUserCreatedGroup(group) {
        return _.include(_.pluck(user.createdGroup, '_id'), group._id);
    }

    function _notifyUser(group) {
        var header = 'Join Group',
            msg = 'You have already joined <span class="text-primary">' + group.name + '</span>.',
            opts = {
                size: 'sm',
                windowClass: 'modal-btn-sm'
            };
        dialogs.notify(header, msg, opts);
    }


}
HeaderController.$inject = ['$scope', '$state', 'Authentication', 'Menus', 'Search', 'Users', 'dialogs', 'lodash', 'UserService'];

'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);
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

// Configuring the Articles module
angular.module('events').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Events', 'events', 'dropdown', '/events(/create)?');
		Menus.addSubMenuItem('topbar', 'events', 'List Events', 'events');
		Menus.addSubMenuItem('topbar', 'events', 'New Event', 'events/create');
	}
]);
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

function EventsController($scope, $state, $stateParams, $location, Authentication, Events, growl, lodash) {
    var _ = lodash;
    $scope.authentication = Authentication;
    $scope.user = Authentication.user;
    if (!$scope.user) {
        $location.path('/')
    }
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
    $scope.voteYes = voteYes;
    $scope.voteNo = voteNo;
    $scope.hasVotedYes = hasVotedYes;
    $scope.hasVotedNo = hasVotedNo;

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
        return event.$promise;
    }

    function remove() {
        var params = {
            eventId: $stateParams.eventId
        };
        var event = Events.remove(params, function() {
            $scope.event = event;
            $state.go('viewGroup.listEvents.viewEvents');
            _notifySuccess('Event successfully removed');
        });
        return event.$promise;
    }

    function update() {
        if ($scope.timeError || $scope.dateError) {
            return _getPromise(false, '');
        };
        var params = {
            eventId: $stateParams.eventId
        };
        $scope.event.group = $stateParams.groupId;
        var event = Events.update(params, $scope.event, function(data) {
            $scope.event = data;
            $state.go('viewGroup.listEvents.viewEvent', {
                eventId: $scope.event._id
            });
        });
        return event.$promise;
    }

    function find() {
        return $scope.events = Events.query();
    };

    function findOne() {
        var event = Events.get({
            eventId: $stateParams.eventId
        }, function() {
            $scope.event = event;
        });
        return event.$promise;
    };

    function _notifySuccess(text) {
        text = text || 'Event updated successfully';
        growl.success(text, {
            title: text
        });
    }

    function voteYes() {
        _addUserToVoteYes($scope.user);
        update().then(success, failure);

        function success(data) {
            _notifySuccess('Voted successfully');
        }

        function failure(data) {
            _deleteUserFromYes($scope.user);
            _addUserToVoteNo($scope.user);
        }
    }

    function voteNo() {
        _addUserToVoteNo($scope.user);
        update().then(success, failure);

        function success(data) {
            _notifySuccess('Voted successfully');
        }

        function failure(data) {
            _deleteUserFromNo($scope.user);
            _addUserToVoteYes($scope.user);
        }
    }

    function _addUserToVoteYes(user) {
        user = user || $scope.user;
        if (_hasUserVotedNo(user)) {
            _deleteUserFromNo(user);
        }
        if (!_hasUserVotedYes(user)) {
            $scope.event.votes.yes.push(user);
        }
    }

    function _addUserToVoteNo(user) {
        user = user || $scope.user;
        if (_hasUserVotedYes(user)) {
            _deleteUserFromYes(user);
        }
        if (!_hasUserVotedNo(user)) {
            $scope.event.votes.no.push(user);
        }
    }

    function _deleteUserFromYes(user) {
        user = user || $scope.user;
        $scope.event.votes.yes = _.reject($scope.event.votes.yes, function(item) {
            return _.isEqual(item._id, user._id);
        });
    }

    function _deleteUserFromNo(user) {
        user = user || $scope.user;
        $scope.event.votes.no = _.reject($scope.event.votes.no, function(item) {
            return _.isEqual(item._id, user._id);
        });
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

    function hasVotedYes(user) {
        return _hasUserVotedYes(user);
    }

    function hasVotedNo(user) {
        return _hasUserVotedNo(user);
    }

    function _hasUserVotedYes(user) {
        user = user || $scope.user;
        return _.include(_.pluck($scope.event.votes.yes, '_id'), user._id);
    }

    function _hasUserVotedNo(user) {
        user = user || $scope.user;
        return _.include(_.pluck($scope.event.votes.no, '_id'), user._id);
    }
}
EventsController.$inject = ['$scope', '$state', '$stateParams', '$location', 'Authentication', 'Events', 'growl', 'lodash'];

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
    $scope.isOwner = isOwner;
    $scope.makeAdmin = makeAdmin;
    $scope.removeAdmin = removeAdmin;
    $scope.canRemoveAdmin = canRemoveAdmin;

    // Group Functions
    function create() {
        // Create new Group object
        var group = new Groups($scope.group);
        // Redirect after save
        return group.$save(function(data) {
            _updateUser(data);
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
        _getUser();
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
        _getUser();     
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

        return _isUserInAdmins($scope.authentication.user);
    }


    function isOwner(member){
        if(member._id !== $scope.group.createdBy._id){
            return false;
        }

        return _isUserInAdmins($scope.group.createdBy);
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
        growl.success(text, {title:text});
    }

    function _updateUser(group){
        $scope.user.createdGroups.push(group);
        Authentication.user = $scope.user;
    }

    function _getUser(){
        $scope.user = Authentication.user;
    }
}
GroupsController.$inject = ['$scope', '$state', '$stateParams', '$location', 'Authentication', 'Groups', 'Search', 'lodash', 'dialogs', '$q', 'growl'];

'use strict';
angular.module('groups').factory('GroupEvents', GroupEvents);

function GroupEvents($http) {
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
        
        debugger;
        if (!angular.isObject(response.data) || !response.data.message) {
            return ($q.reject("An unknown error occurred."));
        }
        // Otherwise, use expected error message.
        return ($q.reject(response.data.message));
    }
    // I transform the successful response, unwrapping the application data
    // from the API response payload.
    function handleSuccess(response) {
    	debugger;
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
GroupEvents.$inject = ['$http'];

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
        debugger;
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
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
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

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication','CarrierFactory',
	function($scope, $http, $location, Authentication, CarrierFactory) {

        CarrierFactory.getCarriers().then(function(data){
            $scope.carriers = data;
        });

		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$scope.credentials.carrier = $scope.credentials.carrier.addr;

			$http.post('/api/users', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(errorResponse) {
				$scope.error = errorResponse.clientMessage;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(errorResponse) {
                $scope.error = errorResponse.clientMessage;
			});
		};

        $scope.confirmPassword = function(){
            var password = $scope.credentials.password || '';
            $scope.isPasswordError =  (password.trimRight() === $scope.credentials.confirmPassword.trimRight());
        };
	}
]);

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

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(errorResponse) {
				$scope.error = errorResponse.clientMessage;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid){
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);
	
				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(errorResponse) {
					$scope.error = errorResponse.clientMessage;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(errorResponse) {
				$scope.error = errorResponse.clientMessage;
			});
		};
	}
]);

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
            responseError: responseError
        };
        
        return provider;

        function responseError(rejection) {
            switch (rejection.status) {
                case 400:
                    if(rejection.data){
                        var data = rejection.data, config = {};
                        data.clientMessage.forEach(function(msg){
                            config.title = msg;
                            growl.warning(msg, config);
                        });
                        data.devMessage.forEach(function(msg){
                            config.title = msg;
                            growl.warning(msg,config);

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
            }

            return $q.reject(rejection);
        }
    }
    HttpProviderInterceptor.$inject = ['$q', '$location', 'Authentication', 'growl'];
}).call(this);

'use strict';

angular.module('users').
	factory('Search', Search);

function Search($http){
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
            return response.data;
        });
    }
    function getGroups(val) {
        return $http.get('/api/users/groups/', {
            params: {
                name: val
            }
        }).then(function(response){
            return response.data;
        });
    }
}
Search.$inject = ['$http'];

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
		.success(function(data){
			return data;
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
