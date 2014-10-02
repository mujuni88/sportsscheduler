'use strict';

var MyResponse = require('../../../custom_objects/MyResponse');
var Sender = require('../../../custom_objects/Sender');
var appJSON = require('../../../custom_objects/AppJSON');

module.exports = function(app) {

app.route('/api/sms')

	.post(function(req, res) {
    	var outputCallback = function(myResponse) {

    		res.json(myResponse);

    	};
    	
    	console.log(req.body);
    	var to,subject,text = null;
    	var myResponse = new MyResponse();

    	if(typeof req.body.to === 'undefined')
    	{
    		myResponse.error.clientMessage = 'Missing "to" parameter in request';
    		res.json(myResponse);
    		return;
    	}
    	else
    		to = req.body.to;

    	if(typeof req.body.subject === 'undefined')
    	{
    		myResponse.error.clientMessage = 'Missing "subject" parameter in request';
    		res.json(myResponse);
    		return;
    	}
    	else
    		subject = req.body.subject;

    	if(typeof req.body.text === 'undefined')
    	{
    		myResponse.error.clientMessage = 'Missing "text" parameter in request';
    		res.json(myResponse);
    		return;
    	}
    	else
    		text = req.body.text;

        console.log('sending sms');
        //console.log(appJSON.getJSON());
        Sender.sendSMS(to,subject,text,outputCallback);
        //Sender.sendSMS('Trey Gaines <treyqg15@gmail.com>','6018801788@cspire1.com','Hello','Hello world',outputCallback);
    });
};