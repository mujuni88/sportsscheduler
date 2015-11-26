'use strict';

var nodemailer = require('nodemailer');
var MyResponse = require('./MyResponse');
var serverJSON = require('../local_files/ui/server.ui.json');
var configJSON = require('../local_files/config.json');

//Should be used in the same manner as a singleton
function Sender() {
    
    // create reusable transporter object using SMTP transport
    //pass: '}_sB*p4:Y]A4ESr'
    /*
    console.log('clientID: ' + configJSON.nodemailer.xoauth2.clientID);
    console.log('clientSecret: ' + configJSON.nodemailer.xoauth2.clientSecret);
    console.log('refreshToken: ' + configJSON.nodemailer.xoauth2.refreshToken);
    console.log('accessToken: ' + configJSON.nodemailer.xoauth2.accessToken);
    */
 	this.transporter = nodemailer.createTransport({
	    service: 'gmail',
	    auth: {
			user: "sportschedulertest@gmail.com", // Your gmail address.
			pass: '}_sB*p4:Y]A4ESr'
		},
	    debug: true
	});

	//this.transporter.on('log', console.log);

}

Sender.prototype.sendSMS = function(to,subject,html,callback) {

	var mailOptions = {

		to: to,
		subject: subject,
		html: html
		
	};

	var response = new MyResponse();

	this.transporter.sendMail(mailOptions, function(err, info){

	    if(err){
	    	//response.setError(serverJSON.api.sms.errors._5,err);
	        console.log(err);
	    }
	    else {

	        console.log('Message sent: ' + info);
	    }

	    if(callback !== null)
    		callback(response);

	});
};

Sender.prototype.senderCallback = function(user) {

	return function(response) {

		console.log('Email sent successfully to: %s',user.email);
	};
};

Sender.prototype.sendTemplate = function(user) {

	var sender = this;

    return function(err,templateHTML) {
        
        sender.sendSMS(user.email, 'Sports Scheduler', templateHTML, sender.senderCallback(user));

    };
};


//I believe this should make it to where only 1 instance will ever be created
module.exports = new Sender();