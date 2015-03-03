'use strict';

var serverJSON = require('../local_files/ui/server.ui.json'),
	mongoose = require('mongoose'),
    MyResponse = require('./MyResponse');

function Helper() {
	
}

/*******PRIVATE FUNCTIONS***********/
function getAttsString(arr)
{
    var attsString = '';

    for(var i = 0; i < arr.length; ++i)
        attsString += arr[i] + ' ';

    return attsString;
}
/********END PRIVATE FUNCTIONS***********/

Helper.getAttsString = function(arr)
{
    var attsString = '';

    for(var i = 0; i < arr.length; ++i)
        attsString += arr[i] + ' ';

    return attsString;
};

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
		_id: { $in: ids}}, function (err, models) {
		console.log('models: ' + models);
		var notFoundModels  = [];

        if (err || !models) {
           respond(false);
        } 
        else if(ids.length !== models.length) {
        	/*
        	for(var i = 0; i < ids.length; ++i) {

        		var found = false;

        		for(var j = 0; j < models.length; ++j)
        		{
        			if(ids[i] === models[j])
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

Helper.findOne = function(model,query,errPath,res) {
    
    console.log('find one');
    var myResponse = new MyResponse();
    var atts = model.objectIDAtts;
    var attsString = getAttsString(atts);

    model.findOne(query)
    .populate({path: attsString})
    .exec(function(err, obj) {

        if (err) {
            console.log('error: ' + err);
            myResponse.transformMongooseError(errPath,String(err));
            res.json(myResponse);
        }
        else
        {

            var Groups = mongoose.model('Group');
            var groupAttsString = '';
            var groupAtts = Groups.objectIDAtts;

            for(var i = 0; i < atts.length; ++i)
            {
                for(var j = 0; j < groupAtts.length; ++j)
                {
                    groupAttsString += atts[i] + '.' + groupAtts[j] + ' ';
                }
            }

            console.log('group atts string: ' + groupAttsString);

            var options = {
                path: groupAttsString,
                model: 'User'
            };

            model.populate(obj, options, function (err, user) {
                myResponse.data = obj;
                res.json(myResponse);
            });
            
        }
    });
};

Helper.populateModel = function(model,obj,errPath,res) {

    var myResponse = new MyResponse();
    var atts = Helper.getAttsString(model.objectIDAtts);
    console.log('atts: ' + atts);
    var options = {
        path: atts
    };

    model.populate(obj, options, function (err, obj) {
        myResponse.data = obj;
        res.json(myResponse);
    });
        
};

module.exports = Helper;