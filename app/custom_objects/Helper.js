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
        endTask: function(arg1, arg2, done) {
            done(null, arg1);
        }
    };

    var populate = function populate(model,obj) {

        return function(arg1,arg2,done) {

            var atts = model.objectIDAtts.slice(0);

            //console.log('atts: ' + JSON.stringify(atts,null,1));

            var rec = function(atts) {
                var optionsModel = mongoose.model(atts[0].model);
                var options = {
                    path: atts[0].name,
                    model: optionsModel.title,
                    select: Helper.attsArryToAttsString(optionsModel.attsToShow)
                };
                //console.log('options: ' + JSON.stringify(options,null,1));
                model.populate(obj, options, function (err, obj) {
                    
                    atts.splice(0,1);
                    //console.log('new atts: ' + atts);
                    if(atts.length === 0)
                        done(null,obj,1);
                    else
                    {
                        //console.log('populated obj: ' + obj);
                        rec(atts);
                    }
                });
            };
            
            rec(atts);
        };
    };

    /*******************END FUNCTIONS*********************/    
    return {
        attsArryToAttsString: function(arr)
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
        executeWaterfall: function(arr,callback) {

            async.waterfall(arr,callback);
        },
        save: function(model,obj) {

            return function(arg1,arg2,done) {

                obj.save(function(err) {

                    var myResponse = new MyResponse();

                    if (err) {
                        console.log('error: ' + err);
                        myResponse.transformMongooseError(model.errPath,String(err));
                    }

                    done(myResponse,obj,1);

                });
            }; 
        },
        update: function(model,query,data) {
            
            return function(arg1,arg2,done) {
                model.update(query,
                {
                    $set: data
                },
                {
                    runValidators: true
                },
                function(err) {
                    if (err) {
                        console.log('error: ' + err);
                        done(err,1,1);
                    }
                    else {
                        console.log('final query: ' + JSON.stringify(query,null,1));
                        console.log('final data: ' + JSON.stringify(query,null,1));

                        Helper.find(model,query,function(err,mod) {
                            var obj = mod[0];
                            done(null,obj,1);
                        });
                    }
                });
            };
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
                    
                    //console.log('err: ' + err);
                    //console.log('models: ' + models);

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

        findWithAllAtts: function(model,query,callback) {

            model.find(query)
            .exec(function(err,mod) {
                callback(err,mod);
            });
        },
        findOneWithAllAtts: function(model,query,callback) {

            model.findOne(query)
            .exec(function(err,mod) {
                callback(err,mod);
            });
        },
        find: function(model,query,callback) {

            model.find(query)
            .select(Helper.attsArryToAttsString(model.attsToShow))
            .exec(function(err,mod) {
                callback(err,mod);
            });
        },
        findOne: function(model,query,callback) {
            model.findOne(query)
            .select(Helper.attsArryToAttsString(model.attsToShow))
            .exec(function(err,mod) {
                callback(err,mod);
            });
        },        
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
        populate: function(model, obj, callback) {

            var atts = model.objectIDAtts.slice(0);

            //console.log('atts: ' + atts);

            var rec = function(atts) {
                var optionsModel = mongoose.model(atts[0].model);
                var options = {
                    path: atts[0].name,
                    model: optionsModel.title,
                    select: Helper.attsArryToAttsString(optionsModel.attsToShow)
                };
                
                //console.log('options: ' + JSON.stringify(options,null,1));
                model.populate(obj, options, function (err, obj) {
                    
                    atts.splice(0,1);
                    //console.log('new atts: ' + atts);
                    if(atts.length === 0)
                        callback(err,obj);
                    else
                    {
                        //console.log('populated obj: ' + obj);
                        rec(atts);
                    }
                });
            };
            
            rec(atts);
        },
        output: function(model,obj,myResponse,res) {
            
            res.status(myResponse.status);

            //coming from an api that doesn't use models
            if(model === null) {

                if(typeof myResponse.error !== 'undefined')
                    res.json(myResponse.error);
                else
                    res.json(myResponse.data);
                
                return;
            }

            if(typeof myResponse.error !== 'undefined')
                res.json(myResponse.error);
            else {

                var functionsArray = model.functionsArray.slice(0);
                functionsArray.unshift(populate(model,obj));
                functionsArray = Helper.buildWaterfall(functionsArray);
                
                Helper.executeWaterfall(functionsArray,function (error, data) {
                    
                    //console.log('data: ' + JSON.stringify(data,null,1));

                    if(myResponse.paginate) {

                        data = {

                            _metadata: myResponse.paginate.metadata,
                            data: data

                        };

                        res.json(data);
                    }
                    else
                        res.json(data);        
                });
            }
        }
    };
})();

module.exports = Helper;
