'use strict';

var serverJSON = require('../local_files/ui/server.ui.json'),
	mongoose = require('mongoose'),
    MyResponse = require('./MyResponse'),
    async = require('async');

var Helper = (function() {

    /*******************PRIVATE FUNCTIONS*********************/

    var waterfallFunctions = {
        startTask: function(done) {
            done(null, 1, 0);
        },
        endTask: function(arg1, done) {
            done(null, arg1);
        }
    };

    /*******************END FUNCTIONS*********************/    
    return {
        getAttsString: function(arr)
        {
            var attsString = '';

            for(var i = 0; i < arr.length; ++i)
                attsString += arr[i] + ' ';

            return attsString;
        },

        /**************** WATERFALL FUNCTIONS ***************/
        buildWaterfall: function(arr) {

            arr.unshift(waterfallFunctions.startTask);
            arr.push(waterfallFunctions.endTask);

            console.log(arr);

            return arr;
        },
        executeWaterfall: function(arr,respond) {

            async.waterfall(arr, 
                function (error, success) {
                    if (error)
                        respond(false); 
                    else
                        respond(true);
            });
        },
        find: function(model,query,callback) {

            model.find(query, function (err, mod) {
                
                //console.log('err: ' + err);
                //console.log('mod: ' + mod);
                callback(err,mod);
            });
        },
        doesObjectExist: function(model,id) {

            return function(arg1,arg2,done) {
                model.find({
                    _id: id}, function (err, mod) {
                        if(err || !mod) {
                            done(true,null);
                        }
                        else
                            done(null,mod);
                });
            };
        },
        doesObjectsExist: function(model,ids) {

            return function(arg1,arg2,done)
            {
                model.find({
                    _id: { $in: ids}}, function (err, models) {
                    
                    console.log('err: ' + err);
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
        },
        /**************** END WATERFALL FUNCTIONS ***********/
        
        isUniqueArray: function(arr) {

            var map = {};
            var i = null;

            for(i = 0; i < arr.length; ++i)
            {
                if(typeof map[arr[i]] === 'undefined')
                    map[arr[i]] = 1;
                else
                    return false;
            }
            
            return true;
        },
        isValidObjectID: function(id) {
    
            if(!mongoose.Types.ObjectId.isValid(id.toString()))
                return false;
            return true;
        },
        isValidObjectIDs: function(ids) {
    
            for(var i = 0; i < ids.length; ++i)
            {
                if(!mongoose.Types.ObjectId.isValid(ids[i].toString()))
                    return false;
            }
            
            return true;
        },
        cleanMergeObj: function(oldVal,newVal) {

            //console.log('oldVal: ' + oldVal);
            console.log('typeof: ' + typeof newVal._id);
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
            else if(typeof newVal._id === "string")
            {
                console.log('string: ' + newVal._id);
                return newVal._id.toString();
            }
            
            return newVal;
        },
        populateModel: function(model,obj,errPath,callback) {

            
            var atts = model.objectIDAtts.slice(0);

            console.log('atts: ' + atts);

            var rec = function(atts) {
                var options = {
                    path: atts[0].name,
                    model: atts[0].model
                };

                model.populate(obj, options, function (err, obj) {
                    
                    
                    atts.splice(0,1);
                    console.log('new atts: ' + atts);
                    if(atts.length === 0)
                        callback(obj);
                    else
                    {
                        console.log('populated obj: ' + obj);
                        rec(atts);
                    }
                });    
            };
            
            rec(atts);
        },
        output: function(myResponse,res) {
            
            res.status(myResponse.status);
            
            if(typeof myResponse.error === 'undefined')
                res.json(myResponse.data);
            else
                res.json(myResponse.error);
        }
    };
})();

module.exports = Helper;