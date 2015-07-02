'use strict';

var PrivateFunctions = (function() {

	var setIsAdmin = function(group) {

		var newMembersArray = [];
		group = group.toObject();

		if(group.members.length > 0) {

			for(var i = 0; i < group.members.length; ++i) {

				var member = group.members[i];

				//see if member is an admin
				for(var j = 0; j < group.admins.length; ++j) {

					if(group.admins[j]._id.id === member._id.id) {

						member.isAdmin = true;
						
						break;
					}
					else
						member.isAdmin = false;
				}

				newMembersArray.push(member);
			}
		}

		group.members = newMembersArray;

		return group;
	};

	return {

		isAdmin: function(obj,arg2,done) {
			
			if(Array.isArray(obj)) {

				for(var i = 0; i < obj.length; ++i) {

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