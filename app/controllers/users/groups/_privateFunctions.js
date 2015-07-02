'use strict';

var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Group = mongoose.model('Group'),
	Helper = require('../../../custom_objects/Helper'),
	_ = require('lodash');

var PrivateFunctions = (function() {

	return {
		create:
		{
			createdGroups: function(req,group)
			{
				return function(arg1,arg2,done) {

					req.user.createdGroups.push(group.id);
					req.user.save(function(err) {
						if (err) {
							err = {
								model: User,
								err: err
							};
							console.log('error: ' + err);
							done(err,null,arg2);
						}
						else {
							
							done(null,group,arg2);
						}
					});
				};
			}
		},
		update: 
		{
			joinedGroups: function(req,group)
			{
				return function(arg1,arg2,done) {

					var i = 0;
					var j = 0;

					console.log('req.body: ' + JSON.stringify(req.body,null,4));
					var oldMembers = group.members;
					var oldMembersIDs = [];
					var oldMembersIDsHash = {};

					//create the hashes for a speed increase later
					for(i = 0; i < oldMembers.length; ++i) {

						oldMembersIDs.push(oldMembers[i].toString());
						oldMembersIDsHash[oldMembers[i].toString()] = 1;
					}

					var members = req.body.members;
					req.body.members = [];

					for(i = 0; i < members.length; ++i) {

						var membersID = members[i].toString();

						if(membersID !== group.createdBy.toString())
							req.body.members.push(membersID);
					}

					var removedUsers = _.difference(oldMembersIDs,req.body.members);

					var query = {
						_id : {
							$in : req.body.members.concat(removedUsers)
						}
					};

					console.log('all users: ' + req.body.members.concat(removedUsers));
					
					Helper.find(User,query,function(err,mod) {

						Helper.populate(User,mod,function(err,mod) {
							
							var saveArray = [];
							
							for(i = 0; i < mod.length; ++i) {

								var updateData = {};
								var user = mod[i];

								//check if user is an old member
								if(typeof oldMembersIDsHash[user.id] !== 'undefined' && removedUsers.indexOf(user.id) > -1) {
									
									for(j = 0; j < user.joinedGroups.length; ++j) {

										if(user.joinedGroups[j].id === group.id) {

											user.joinedGroups.splice(j,1);
											updateData.joinedGroups = user.joinedGroups;

											break;
										}
									}
								}
								//user is a current member of the group
								else {

									var alreadyJoined = false;
									console.log('user is new member or existing user: ' + user._id);
									console.log('groups count: ' + user.joinedGroups.length);

									for(j = 0; j < user.joinedGroups.length; ++j) {
										//user already has group added to its joinedGroups attribute. Just skip this user
										if(user.joinedGroups[j].id === group.id) {

											alreadyJoined = true;

											break;
										}
									}

									if(!alreadyJoined) {

										console.log('user has not yet joined: ' + user.id);
										user.joinedGroups.push(group.id);
										updateData.joinedGroups = user.joinedGroups; 
									}
								}

								//create save functions for each object to use in waterfall later
								query = {
									_id : user._id
								};

								saveArray.push(Helper.update(User,query,updateData));
							}

							//call all of the saves using waterfall
							saveArray = Helper.buildWaterfall(saveArray);

							Helper.executeWaterfall(saveArray,function(err,data) {

								if (err) {

									err = {

										model: User,
										err: err

									};

									console.log('error: ' + err);
									done(err,null,arg2);
								}
								else {

									query = {

										_id : group.id

									};

									Helper.find(Group,query,function(err,mod) {

										if (err) {

											err = {

												model: Group,
												err: err

											};

											console.log('error: ' + err);
											done(err,null,arg2);
										}
										else {

											group = mod[0];
											done(null,group,1);
										}
									});
								}
								
							});
						});
					});
				};
			}
		}
	};
})();

module.exports = PrivateFunctions;