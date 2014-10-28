'use strict';

var MyError = require('./MyError');
var httpCodesJSON = require('../local_files/http/codes.json');
var serverJSON = require('../local_files/ui/server.ui.json');

function MyResponse() {
    
    this.data = undefined;

    //default to successful http code
    this.status = 200;
    this.devMessage = undefined;
    this.clientMessage = undefined;
    this.error = undefined;
}

MyResponse.prototype.setError = function(errObj,data)
{
	this.devMessage = errObj.devMessage;
	this.clientMessage = errObj.clientMessage;
	this.status = errObj.status;	
};

MyResponse.prototype.getErrorObjectByClientMessage = function(message)
{
	for(var index in serverJSON.api.users.errors)
	{
		var obj = serverJSON.api.users.errors[index];
		if(message === obj.clientMessage)
			return obj;
	}
};

module.exports = MyResponse;