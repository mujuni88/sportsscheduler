'use strict';

var fs = require('fs');

//singleton closure
module.exports = (function() {

	var originalData = null;
	var parsedJSON = null;

	function setJSON(data)
	{
		parsedJSON = JSON.parse(data);
		originalData = data;
	}

	return {

		init: function() {
			var file = __dirname + '/../local_files/app.json';

			fs.readFile(file, 'utf8', function (err, data) {
				if (err) {
			  		console.log('Error: ' + err);
			    	return;
			  	}
			  	//console.log('data: ' + data);
			  	setJSON(data);
			});
		},

		getParsedJSON: function() {
			return parsedJSON;
		},
		getOriginalData: function() {
			return originalData;
		}
	};

})();