'use strict';

var MyError = require('./MyError');
var httpCodesJSON = require('../local_files/http/codes.json');

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

module.exports = MyResponse;