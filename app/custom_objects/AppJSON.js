'use strict';

var fs = require('fs');

//singleton closure
module.exports = (function() {

	var json = null;

	function setJSON(data)
	{
		json = JSON.parse(data);
	}

	return {

		init: function() {

			var file = __dirname + '/../local_files/app.json';

			fs.readFile(file, 'utf8', function (err, data) {
				if (err) {
			  		console.log('Error: ' + err);
			    	return;
			  	}

			  	setJSON(data);
			});
		},

		getJSON: function() {
			return json;
		}
	};

})();