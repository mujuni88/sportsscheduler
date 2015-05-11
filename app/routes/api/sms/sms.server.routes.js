'use strict';

var MyResponse = require('../../../custom_objects/MyResponse');
var Sender = require('../../../custom_objects/Sender');
var serverJSON = require('../../../local_files/ui/server.ui.json');
var Helper = require('../../../custom_objects/Helper');

module.exports = function(app) {

app.route('/api/sms')

	.post(function(req, res) {
    	var outputCallback = function(myResponse) {

    		res.json(myResponse);

    	};

    	console.log(req.body);
    	var to,subject,text = null;
    	var myResponse = new MyResponse();

        var regEx = new RegExp(serverJSON.api.sms.to.invalid.regex);

    	if(typeof req.body.to === 'undefined')
    	{
            myResponse.addMessages(serverJSON.api.sms.to.empty);
            Helper.output(null,null,myResponse,res);
    		
            return;
    	}
        else if(!regEx.test(req.body.to))
        {
            myResponse.addMessages(serverJSON.api.sms.to.invalid);
            Helper.output(null,null,myResponse,res);
            
            return;
        }
    	else
    		to = req.body.to;


    	if(typeof req.body.subject === 'undefined')
    	{
            myResponse.addMessages(serverJSON.api.sms.subject.empty);
            Helper.output(null,null,myResponse,res);
    		
            return;
    	}
    	else
    		subject = req.body.subject;

    	if(typeof req.body.text === 'undefined')
    	{
            myResponse.addMessages(serverJSON.api.sms.text.empty);
            Helper.output(null,null,myResponse,res);
    		
            return;
    	}
    	else
    		text = req.body.text;

        console.log('sending sms');
        console.log('to: '+ to);
        console.log('subject: ' + subject);
        console.log('text: ' + text);
        
        Sender.sendSMS(to,subject,text,outputCallback);
    });
};