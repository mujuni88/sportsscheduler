
// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
'use strict';
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
