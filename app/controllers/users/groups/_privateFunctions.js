'use strict';

var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Group = mongoose.model('Group'),
	Helper = require('../../../custom_objects/Helper'),
	_ = require('lodash');

var PrivateFunctions = (function() {

	return {
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

					var removedUsers = _.difference(oldMembersIDs,req.body.members);
					console.log('removedUsers: ' + removedUsers);

					var query = {
						_id : {
							$in : req.body.members.concat(removedUsers)
						}
					};

					console.log('all users: ' + req.body.members.concat(removedUsers));
					Helper.find(User,query,function(err,mod) {

						Helper.populate(User,mod,function(err,mod) {
							var saveArray = [];

							console.log('members: ' + req.body.members);
							console.log('mod: ' + mod.length);
							for(i = 0; i < mod.length; ++i)
							{
								var updateData = {};
								var user = mod[i];
								console.log('working on user._id: ' + user._id);

								//check if user is an old member
								if(typeof oldMembersIDsHash[user._id.toString()] !== 'undefined' && removedUsers.indexOf(user._id.toString()) > -1)
								{
									console.log('user id old member: ' + user._id);
									console.log('groups count: ' + user.joinedGroups.length);
									for(j = 0; j < user.joinedGroups.length; ++j)
									{
										console.log('remove id? : ' + user.joinedGroups[j]._id);
										console.log('group id: ' + group.id);
										if(user.joinedGroups[j]._id.toString() === group.id.toString())
										{
											user.joinedGroups.splice(j,1);
											updateData.joinedGroups = user.joinedGroups;
											break;
										}
									}
								}
								//user is a current member of the group
								else
								{
									var alreadyJoined = false;
									console.log('user is new member or existing user: ' + user._id);
									console.log('groups count: ' + user.joinedGroups.length);

									for(j = 0; j < user.joinedGroups.length; ++j)
									{
										//user already has group added to its joinedGroups attribute. Just skip this user
										if(user.joinedGroups[j]._id.toString() === group.id.toString())
										{
											alreadyJoined = true;
											break;
										}
									}
									if(!alreadyJoined)
									{
										console.log('user has not yet joined: ' + user._id);
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
									console.log('error: ' + err);
									done(err,null,1);
								}
								else {
									query = {
										_id : group.id
									};

									Helper.find(Group,query,function(err,mod) {

										if (err) {
											console.log('error: ' + err);
											done(err,null,1);
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
					//5515a5d1c6c8151504e9bedf
					//554908e4a7ed040000a11461
					//add to joinedGroup
					//for(var i = 0; i < req.body.members; ++i)
					//{
						
					//}
						
				};
			}
		}
	};
})();

module.exports = PrivateFunctions;