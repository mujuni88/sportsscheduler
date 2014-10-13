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
        var smsJSON = appJSON.getParsedJSON().server.api.sms;
    	var to,subject,text = null;
    	var myResponse = new MyResponse();
        
        var regEx = new RegExp(/[\d]{10,}@[a-z]*[\d]*\.[a-z]{1,4}/);

    	if(typeof req.body.to === 'undefined')
    	{
    		myResponse.error.clientMessage = smsJSON.errors._1;
    		res.json(myResponse);
    		return;
    	}
        else if(!regEx.test(req.body.to))
        {
            myResponse.error.clientMessage = smsJSON.errors._2;
            res.json(myResponse);
            return;
        }
    	else
    		to = req.body.to;


    	if(typeof req.body.subject === 'undefined')
    	{
    		myResponse.error.clientMessage = smsJSON.errors._3;
    		res.json(myResponse);
    		return;
    	}
    	else
    		subject = req.body.subject;

    	if(typeof req.body.text === 'undefined')
    	{
    		myResponse.error.clientMessage = smsJSON.errors._4;
    		res.json(myResponse);
    		return;
    	}
    	else
    		text = req.body.text;

        console.log('sending sms');
        //console.log(appJSON.getJSON());
        Sender.sendSMS(to,subject,text,outputCallback);
    });
};