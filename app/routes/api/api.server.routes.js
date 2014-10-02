'use strict';

module.exports = function(app) {

app.route('/api')

	.get(function(req, res) {
    
        res.send('API');

    });
};