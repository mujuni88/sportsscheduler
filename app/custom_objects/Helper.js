'use strict';

var serverJSON = require('../local_files/ui/server.ui.json'),
	mongoose = require('mongoose'),
    MyResponse = require('./MyResponse'),
    async = require('async');

function Helper() {
	
}

/*******PRIVATE FUNCTIONS***********/

/********END PRIVATE FUNCTIONS***********/

Helper.getAttsString = function(arr)
{
    var attsString = '';

    for(var i = 0; i < arr.length; ++i)
        attsString += arr[i] + ' ';

    return attsString;
};

/**************** WATERFALL FUNCTIONS *********************/

Helper.isValidObjectID = function(id,model,respond) {

	return function(done) {
    	model.findOne({_id: id}, function (err, mod) {
    		
    		console.log('err: ' + err);
            
            if (err || !mod) {
            	done(true,false);
            } else {
            	done(null,true);
            }
        });
    };
};


Helper.isValidObjectIDs = function(ids,model) {

    return function(done)
    {
    	model.find({
    		_id: { $in: ids}}, function (err, models) {
    		console.log('models: ' + models);
    		var notFoundModels  = [];

            if (err || !models) {
               done(true,false);
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

            	done(true,false);
            }
            
            done(null, true);
    	});
    };
};

/**************** END WATERFALL FUNCTIONS *********************/

Helper.cleanMergeObj = function(oldVal,newVal) {

    //console.log('oldVal: ' + oldVal);
    console.log('newVal: ' + JSON.stringify(newVal, null, 4));
    console.log('isArray: ' + Array.isArray(newVal));
    if(Array.isArray(newVal))
    {
        if(newVal.length > 0)
        {
            //as long as the first index has an _id, then i know that this array is an array of refs
            if(typeof newVal[0]._id !== "undefined")
            {
                var arr = [];
                for(var i = 0; i < newVal.length; ++i)
                {
                    console.log('id: ' + newVal[i]._id);
                    arr.push(newVal[i]._id.toString());
                }

                return arr;
            }
        }
    }
    
    return newVal;
};

Helper.findOne = function(model,query,errPath,res) {
    
    console.log('find one');
    var myResponse = new MyResponse();
    var atts = model.objectIDAtts;
    var attsString = Helper.getAttsString(atts);

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
        myResponse.setData(obj,res);
    });
        
};

module.exports = Helper;