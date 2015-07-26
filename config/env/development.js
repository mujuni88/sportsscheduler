'use strict';

module.exports = {
	db: 'mongodb://localhost/mean-dev',
	app: {
		title: 'SportsScheduler | Dev'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || '1838551826370122',
		clientSecret: process.env.FACEBOOK_SECRET || 'de4b9f69dec4591797fee5c5d0f3025b',
		callbackURL: 'http://localhost:3000/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'OyoK7wIfekH1UKeFJyw0p8Q68',
		clientSecret: process.env.TWITTER_SECRET || '41P67E7ckuyvPVSHhgkKRJBm2Q8BIJTSeGeKCWJuSFHbwafXH4',
		callbackURL: 'http://localhost:3000/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || '63767316383-j3essslh76rsr167l9ek181pfp321pdo.apps.googleusercontent.com',
		clientSecret: process.env.GOOGLE_SECRET || 'ohUIThCioXqfnoUyldSs3cak',
		callbackURL: 'http://localhost:3000/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || 'APP_ID',
		clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
		callbackURL: 'http://localhost:3000/auth/linkedin/callback'
	},
	github: {
		clientID: process.env.GITHUB_ID || 'APP_ID',
		clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
		callbackURL: 'http://localhost:3000/auth/github/callback'
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
