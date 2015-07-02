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
function ready() {
    //Fixing facebook bug with redirect
    if (window.location.hash === '#_=_') window.location.hash = '#!';

    //Then init the app
    angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
}
