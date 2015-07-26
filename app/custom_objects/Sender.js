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
 	this.transporter = nodemailer.createTransport('SMTP',{
	    service: 'Gmail',
	    auth: {
		    XOAuth2: {
				user: "sportschedulertest@gmail.com", // Your gmail address.
				                                    // Not @developer.gserviceaccount.com
				clientId: configJSON.nodemailer.xoauth2.clientID,
				clientSecret: configJSON.nodemailer.xoauth2.clientSecret,
				refreshToken: configJSON.nodemailer.xoauth2.refreshToken,
				accessToken: configJSON.nodemailer.xoauth2.accessToken,

			},
		},
	    debug: true
	});

	//this.transporter.on('log', console.log);

}

Sender.prototype.sendSMS = function(to,subject,text,callback) {

	var mailOptions = {

		to: to,
		subject: subject,
		text: text
		
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


//I believe this should make it to where only 1 instance will ever be created
module.exports = new Sender();