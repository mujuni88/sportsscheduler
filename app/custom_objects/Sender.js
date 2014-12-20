'use strict';

var nodemailer = require('nodemailer');
var MyResponse = require('./MyResponse');
var serverJSON = require('../local_files/ui/server.ui.json');

//Should be used in the same manner as a singleton
function Sender() {
    
    // create reusable transporter object using SMTP transport
 	this.transporter = nodemailer.createTransport({
	    service: 'Gmail',
	    auth: {
	        user: 'sportschedulertest@gmail.com',
	        pass: '}_sB*p4:Y]A4ESr'
	    }
	});
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
	    	response.setError(serverJSON.api.sms.errors._5,err);
	        console.log(err);
	    }else{
	        console.log('Message sent: ' + info.response);
	    }

    	callback(response);

	});
};


//I believe this should make it to where only 1 instance will ever be created
module.exports = new Sender();