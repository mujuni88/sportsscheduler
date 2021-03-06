'use strict';

var async = require('async'),
	mongoose = require('mongoose'),
	Helper = require('../../../../custom_objects/Helper');

var PrivateFunctions = (function() {

	var populateAtts = function(user,attsObj) {

		return function (arg1,arg2,done) {
		
			var model = mongoose.model(attsObj.model);
			
			Helper.populate(model,user[attsObj.name],function(err,group) {

				done(null,user,1);
			});
		};
	};

	return {

		populateAtts: function(obj,arg2,done) {
			
			var Event = mongoose.model('Event');
			var functionsArray = [];
			var j = 0;

			if(Array.isArray(obj)) {

				for(var i = 0; i < obj.length; ++i) {

					for(j = 0; j < Event.objectIDAtts.length; ++j) {
						
						functionsArray.push(populateAtts(obj[i],Event.objectIDAtts[j]));	
					}
				}
			}
			else {
			
				for(j = 0; j < Event.objectIDAtts.length; ++j) {
						
					functionsArray.push(populateAtts(obj,Event.objectIDAtts[j]));	
				}
			}
			
			functionsArray = Helper.buildWaterfall(functionsArray);

			Helper.executeWaterfall(functionsArray,function (err, user) {

				done(null,obj,1);
			});
		}
	};
})();

module.exports = PrivateFunctions;