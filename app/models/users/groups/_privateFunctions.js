'use strict';

var PrivateFunctions = (function() {

	var setIsAdmin = function(group) {

		var newMembersArray = [];
		group = group.toObject();

		console.log('functionsArray');
		if(group.members.length > 0)
		{
			for(var i = 0; i < group.members.length; ++i)
			{
				var member = group.members[i];
				var memberID = member._id;

				console.log('list admins: ' + group.admins);
				console.log('memberID: ' + memberID);
				//see if member is an admin

				for(var j = 0; j < group.admins.length; ++j)
				{
					if(group.admins[j]._id.toString() === memberID.toString())
					{
						console.log('isAdmin: ' + memberID);

						member.isAdmin = true;
						console.log('member: ' + member);
						break;
					}
					else
						member.isAdmin = false;
				}


				newMembersArray.push(member);

			}
		}

		group.members = newMembersArray;
		console.log(JSON.stringify(group.members,null,4));
		return group;
	};

	return {

		isAdmin: function(obj,arg2,done) {
			console.log('group: ' + obj);
			console.log('arg2: ' + arg2);
			
			if(Array.isArray(obj))
			{
				for(var i = 0; i < obj.length; ++i)
				{
					obj[i] = setIsAdmin(obj[i]);
				}
			}
			else
				obj = setIsAdmin(obj);

			done(null,obj,1);
		}
	};
})();

module.exports = PrivateFunctions;