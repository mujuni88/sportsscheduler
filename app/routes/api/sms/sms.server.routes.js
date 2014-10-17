'use strict';

var MyResponse = require('../../../custom_objects/MyResponse');
var Sender = require('../../../custom_objects/Sender');
var serverJSON = require('../../../local_files/ui/server.ui.json');

module.exports = function(app) {

app.route('/api/sms')

	.post(function(req, res) {
    	var outputCallback = function(myResponse) {

    		res.json(myResponse);

    	};

    	console.log(req.body);
    	var to,subject,text = null;
    	var myResponse = new MyResponse();

        var regEx = new RegExp(/[\d]{10,}@[a-z]*[\d]*\.[a-z]{1,4}/);

    	if(typeof req.body.to === 'undefined')
    	{
            myResponse.setError(serverJSON.api.sms.errors._1,null);
    		res.json(myResponse);
    		
            return;
    	}
        else if(!regEx.test(req.body.to))
        {
            myResponse.setError(serverJSON.api.sms.errors._2,null);
            res.json(myResponse);
            
            return;
        }
    	else
    		to = req.body.to;


    	if(typeof req.body.subject === 'undefined')
    	{
            myResponse.setError(serverJSON.api.sms.errors._3,null);
    		res.json(myResponse);
    		
            return;
    	}
    	else
    		subject = req.body.subject;

    	if(typeof req.body.text === 'undefined')
    	{
            myResponse.setError(serverJSON.api.sms.errors._4,null);
    		res.json(myResponse);
    		
            return;
    	}
    	else
    		text = req.body.text;

        console.log('sending sms');
        
        Sender.sendSMS(to,subject,text,outputCallback);
    });
};