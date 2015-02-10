'use strict';

var MyError = require('./MyError');
var httpCodesJSON = require('../local_files/http/codes.json');
var serverJSON = require('../local_files/ui/server.ui.json');
var errMessage = null;
var foundObj = null;

function MyResponse() {
    
    this.data = undefined;

    //default to successful http code
    this.status = 200;
    this.devMessage = undefined;
    this.clientMessage = undefined;
    this.error = undefined;
}

function findErrorObject(obj) {

	//console.log('errMessage: ' + errMessage);
	if(errMessage === obj)
	{
		return true;
	}

	return false;
}

function traverse(o,func) {
    for (var i in o) {        

        if (o[i] !== null && typeof(o[i]) === 'object') {
            //going on step down in the object tree!!
            traverse(o[i],func);   
        }
        else
        {
        	if(func(o[i]))
        		foundObj = o;
        }

        if(foundObj)
        	return;
    }
}

MyResponse.prototype.setError = function(errObj)
{
	if(typeof this.error === 'undefined')
		this.error = new MyError();

	this.error.messages.push(errObj);
	this.status = errObj.status;
};

MyResponse.prototype.transformMongooseError = function(modelPath,err)
{
	var i = 0;
	var path = null;
	var copyOfServerJSON = serverJSON;
	if(err.indexOf('CastError') !== -1)
	{
		path = modelPath.split('.');

		for(i = 0; i < path.length; ++i)
			copyOfServerJSON = copyOfServerJSON[path[i]];

		//("[\w]*")
		var regEx = /path ("[\w]*")/;
		var match = regEx.exec(err)[1].replace(/"/g,'');

		if(match.indexOf('.') !== -1)
		{
			match = match.split('.');
		}

		if(Array.isArray(match))
		{
			for(i = 0; i < match.length; ++i)
			{
				copyOfServerJSON = copyOfServerJSON[match[i]];
			}
		}
		else
			copyOfServerJSON = copyOfServerJSON[match];

		this.setError(copyOfServerJSON.invalid);
	}
	else if(err.indexOf('ValidationError') !== -1)
	{
		err = err.split(':')[1];
		errMessage = err.trim();

		var messages = errMessage.split(',');
		var att = null;
		var errorType = null;

		if(Array.isArray(messages))
		{
			for(i = 0; i < messages.length; ++i)
			{
				errMessage = messages[i].trim();
				console.log('errMessage: ' + errMessage);
				traverse(copyOfServerJSON,findErrorObject);
				this.setError(foundObj);
				foundObj = null;
			}
		}
		else
		{
			traverse(copyOfServerJSON,findErrorObject);
			this.setError(foundObj);
		}
	}
	else if(err.indexOf('MongoError') !== -1)
	{
		path = modelPath.split('.');

		for(i = 0; i < path.length; ++i)
			copyOfServerJSON = copyOfServerJSON[path[i]];

		var prop = err.substring(err.lastIndexOf("$")+1,err.lastIndexOf("_"));

		if(err.indexOf('E11000') !== -1)
			this.setError(copyOfServerJSON[prop].duplicate);
	}
};

module.exports = MyResponse;