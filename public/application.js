'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName)
    .run(['editableOptions', xeditableOptions])
    .config(['$locationProvider',config]);
//Then define the init function for starting up the application
angular.element(document).ready(ready);

function config($locationProvider) {
    $locationProvider.hashPrefix('!');
}

function xeditableOptions(editableOptions, editableThemes) {
    editableOptions.theme = 'bs3';
    editableThemes.bs3.inputClass = 'input-sm';
    editableThemes.bs3.buttonsClass = 'btn-sm';
}
function ready() {
    //Fixing facebook bug with redirect
    if (window.location.hash === '#_=_') window.location.hash = '#!';

    //Then init the app
    angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
}
