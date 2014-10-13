'use strict';

var appJSON = require('../../../custom_objects/AppJSON');

module.exports = function(app) {

app.route('/api/file/:file_id')

	.get(function(req, res) {
    	
    	var fileID = parseInt(req.params.file_id);
    	console.log('fileID: ' + fileID);
    	switch(fileID)
    	{
    		case 1:
    			console.log('here');
    			res.send(appJSON.getParsedJSON());
    			break;
    	}
        
        //res.send('File Not Found');

    });

};