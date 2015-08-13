'use strict';

module.exports = {
	db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://localhost/mean',
	assets: {
        lib: {
            css: [
                // 'public/modules/**/css/*.csspublic/lib/bootstrap/dist/css/bootstrap.css',
                // 'public/lib/bootstrap/dist/css/bootstrap-theme.css',
                'public/modules/core/css/bootstrap.css',
                'public/lib/animate.css/animate.min.css',
                'public/lib/angular-fx/dist/angular-fx.min.css',
                'public/lib/angular-xeditable/dist/css/xeditable.min.css',
                'public/lib/angular-dialog-service/dist/dialogs.min.css',
                'public/lib/components-font-awesome/css/font-awesome.min.css',
                'public/lib/angular-growl-v2/build/angular-growl.min.css',
                'public/lib/ngprogress/ngProgress.min.css'
            ],
            js: [
                'public/lib/angular/angular.js',
                'public/lib/angular-sanitize/angular-sanitize.min.js',
                'public/lib/angular-resource/angular-resource.min.js',
                'public/lib/angular-animate/angular-animate.min.js',
                'public/lib/angular-ui-router/release/angular-ui-router.min.js',
                'public/lib/angular-ui-utils/ui-utils.min.js',
                'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
                'public/lib/angular-validation/dist/angular-validation.min.js',
                'https://maps.googleapis.com/maps/api/js?libraries=places&sensor=false',
                'public/lib/ng-google-places-autocomplete/src/ngAutocomplete.min.js',
                'public/lib/ng-lodash/build/ng-lodash.min.js',
                'public/lib/angular-fx/dist/angular-fx.min.js',
                'public/lib/angular-xeditable/dist/js/xeditable.min.js',
                'public/lib/angular-dialog-service/dist/dialogs.min.js',
                'public/lib/angular-growl-v2/build/angular-growl.min.js',
                'public/lib/ngprogress/build/ngProgress.min.js',
                'public/lib/angular-utils-pagination/dirPagination.js'
            ]
        },
		css: 'public/dist/application.min.css',
		js: 'public/dist/application.js'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || '1707771316114841',
		clientSecret: process.env.FACEBOOK_SECRET || 'f89244c2b34aa0d893bb10409b0a9ab3',
		callbackURL: 'http://sportsscheduler.herokuapp.com/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'OyoK7wIfekH1UKeFJyw0p8Q68',
		clientSecret: process.env.TWITTER_SECRET || '41P67E7ckuyvPVSHhgkKRJBm2Q8BIJTSeGeKCWJuSFHbwafXH4',
		callbackURL: 'http://sportsscheduler.herokuapp.com/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || '63767316383-2jp0a7o9ds6vlhvenr1ov94m99mjm0d2.apps.googleusercontent.com',
		clientSecret: process.env.GOOGLE_SECRET || 'YEKnpgEj_tzelkcrJnI9No_c',
		callbackURL: 'http://sportsscheduler.herokuapp.com/auth/google/callback',
		apiKey:'AIzaSyDM9sJYRl6GO1TPmaDwBu9UxueH2RxJ-eY'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || 'APP_ID',
		clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
		callbackURL: 'http://sportsscheduler.herokuapp.com/auth/linkedin/callback'
	},
	github: {
		clientID: process.env.GITHUB_ID || 'APP_ID',
		clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
		callbackURL: 'http://sportsscheduler.herokuapp.com/auth/github/callback'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'SportsScheduler',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'gmail',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'sportschedulertest@gmail.com',
				pass: process.env.MAILER_PASSWORD || '}_sB*p4:Y]A4ESr'
			}
		}
	}
};
