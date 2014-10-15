'use strict';

var MyError = require('./MyError');
var httpCodesJSON = require('../local_files/http/codes.json');

function MyResponse() {
    
    this.data = {};
    this.status = null;
    this.clientMessage = '';
    this.error = null;
}

MyResponse.prototype.setError = function(errObj,data)
{
	var myError = new MyError();
	myError.clientMessage = errObj.clientMessage;
	myError.status = errObj.status;			
	myError.data = data;
	this.status = errObj.status;
	
	this.error = myError;
};

module.exports = MyResponse;