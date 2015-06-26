'use strict';

module.exports = {
	app: {
		title: 'SportsScheduler',
		description: 'Schedule manager for sports teams',
		keywords: 'sports, scheduler, calendar, events, basketball, baseball, football, soccer'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				//'public/modules/**/css/*.csspublic/lib/bootstrap/dist/css/bootstrap.css',
				//'public/lib/bootstrap/dist/css/bootstrap-theme.css',
				'public/modules/core/css/bootstrap.css',
                'public/lib/animate.css/animate.min.css',
                'public/lib/angular-fx/src/css/angular-fx.css',
                'public/lib/angular-xeditable/dist/css/xeditable.css',
				'public/lib/angular-dialog-service/dist/dialogs.min.css',
				'public/lib/components-font-awesome/css/font-awesome.min.css',
				'public/lib/angular-growl-v2/build/angular-growl.min.css',
				'public/lib/ngprogress/ngProgress.css'
			],
			js: [
				'public/lib/angular/angular.js',
                'public/lib/angular-sanitize/angular-sanitize.min.js',
				'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-animate/angular-animate.js',
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/angular-validation/dist/angular-validation.min.js',
				'https://maps.googleapis.com/maps/api/js?libraries=places&sensor=false',
				'public/lib/ng-google-places-autocomplete/src/ngAutocomplete.js',
				'public/lib/ng-lodash/build/ng-lodash.min.js',
				'public/lib/angular-fx/src/js/angular-fx.js',
                'public/lib/angular-xeditable/dist/js/xeditable.min.js',
				'public/lib/angular-dialog-service/dist/dialogs.min.js',
				'public/lib/angular-growl-v2/build/angular-growl.js',
				'public/lib/ngprogress/build/ngProgress.min.js'
            ]
		},
		css: [
			'public/modules/**/css/*.css',
			'public/modules/**/css/!bootstrap*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
