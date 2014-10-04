'use strict';

var nodemailer = require('nodemailer');
var MyResponse = require('./MyResponse');
var MyError = require('./MyError');

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

 	/*
 	this.mailOptions = {
	    from: 'Trey Gaines <treyqg15@gmail.com>', // sender address
	    to: '6018801788@cspire1.com', // list of receivers
	    subject: 'Hello', // Subject line
	    text: 'Hello world', // plaintext body
	    html: '<b>Hello world1</b>' // html body
	};
	*/
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
	    	var error = new MyError();
	    	error.clientMessage = 'Server Error';
	    	error.data = err;
	    	response.error = error;
	        console.log(err);
	    }else{
	    	response.clientMessage = 'SMS Sent Successfully';
	        console.log('Message sent: ' + info.response);
	    }

    	callback(response);

	});
};


//I believe this should make it to where only 1 instance will ever be created
module.exports = new Sender();