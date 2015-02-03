'use strict';

var serverJSON = require('../local_files/ui/server.ui.json'),
	mongoose = require('mongoose');

function Helper() {
	
}

/*******PRIVATE FUNCTIONS***********/

/********END PRIVATE FUNCTIONS***********/

Helper.isValidObjectID = function(id,model,respond) {

	//	console.log('function');
	model.findOne({_id: id}, function (err, mod) {
		
		console.log('err: ' + err);
        
        if (err || !mod) {
        	console.log('not valid');
        	respond(false);
        } else {
        	console.log('valid');
        	respond(true);
        }
    });
};

Helper.isValidObjectIDs = function(ids,model,respond) {

	model.find({
		_id: { $in: ids}}, function (err, admins) {
		console.log('admins: ' + admins);
		var notFoundAdmins  = [];

        if (err || !admins) {
           respond(false);
        } 
        else if(ids.length !== admins.length) {
        	/*
        	for(var i = 0; i < ids.length; ++i) {

        		var found = false;

        		for(var j = 0; j < admins.length; ++j)
        		{
        			if(ids[i] === admins[j])
        			{
        				found = true;
        				break;
        			}
        		}

        		if(!found)
        			notFoundAdmins.push(ids[i]);
        	}
			*/

        	respond(false);
        }
        
        respond(true);
	});
};

module.exports = Helper;