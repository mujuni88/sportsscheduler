'use strict';

var MyError = require('./MyError'),
	httpCodesJSON = require('../local_files/http/codes.json'),
	serverJSON = require('../local_files/ui/server.ui.json'),
	errMessage = null,
	Helper = require('./Helper'),
	Paginate = require('./Paginate');

function MyResponse() {

    this.error = undefined;
    this.status = 200;
    this.data = undefined;
    this.paginate = undefined;
}

function getMessage(json,path) {

	for(var i = 0; i < path.length; ++i)
		json = json[path[i]];

	return json;
}

MyResponse.prototype.addMessages = function(errObj) {

	if(typeof this.error === 'undefined')
		this.error = new MyError();
	
	this.error.devMessage.push(errObj.devMessage);
	this.error.clientMessage.push(errObj.clientMessage);

	this.status = errObj.status;
};

MyResponse.prototype.setData = function(data) {
	
	this.data = data;
};

MyResponse.prototype.setPaginate = function(count) {

	var opt = {
	
		count: count

	};

	this.paginate = new Paginate();
	this.paginate.setMetadata(opt);
};

MyResponse.prototype.transformMongooseError = function(modelPath,err) {

	var i = 0;
	var path = null;
	var copyOfServerJSON = serverJSON;
	var message = null;
	var completePath = null;

	if(err.indexOf('CastError') !== -1) {

		path = modelPath.split('.');

		for(i = 0; i < path.length; ++i)
			copyOfServerJSON = copyOfServerJSON[path[i]];

		console.log('err: ' + err);
		//("[\w]*")
		var regEx = /path ("[\w.*]*")/;
		var match = regEx.exec(err)[1].replace(/"/g,'');

		if(match.indexOf('.') !== -1) {

			match = match.split('.');
		}

		if(Array.isArray(match)) {

			for(i = 0; i < match.length; ++i) {

				copyOfServerJSON = copyOfServerJSON[match[i]];
			}
		}
		else
			copyOfServerJSON = copyOfServerJSON[match];

		if(typeof copyOfServerJSON === 'undefined') {

			this.addMessages(serverJSON.api.default.error.castError);
			return;
		}

		this.addMessages(copyOfServerJSON.invalid);
	}
	else if(err.indexOf('ValidationError') !== -1) {

		err = err.split(':')[1];
		errMessage = err.trim();
		console.log('stuff: ' + err);
		var messages = errMessage.split(',');

		if(Array.isArray(messages)) {

			for(i = 0; i < messages.length; ++i) {

				errMessage = messages[i].trim();
				completePath = modelPath + '.' + errMessage;
				path = completePath.split('.');
				message = getMessage(copyOfServerJSON,path);
				this.addMessages(message);
			}
		}
		else {

			completePath = modelPath + '.' + errMessage;
			path = completePath.split('.');
			message = getMessage(copyOfServerJSON,path);
			this.addMessages(message);
		}
	}
	else if(err.indexOf('MongoError') !== -1) {

		path = modelPath.split('.');

		for(i = 0; i < path.length; ++i)
			copyOfServerJSON = copyOfServerJSON[path[i]];

		var prop = err.substring(err.lastIndexOf("$")+1,err.lastIndexOf("_"));

		if(err.indexOf('E11000') !== -1)
			this.addMessages(copyOfServerJSON[prop].duplicate);
	}
};

module.exports = MyResponse;