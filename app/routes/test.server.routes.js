'use strict';

var Mirror = require('../models/Mirror');

module.exports = function(app) {
	
app.route('/test')
    
    .get(function(req, res) {
    
        Mirror.find(function(err, mirror) {
            //res.send('GET');

            if (err)
                res.send(err);

            res.json(mirror);
        });
    })

    .post(function(req,res) {
    
        //res.send('POST');
        var arr = {};
        
        for(var i in req.body)
            arr[i] = req.body[i];
        
        var mirror = new Mirror();
        mirror.json = arr;

        mirror.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'POST Successful!' });
        });
    });

app.route('/test/:user_id')
    
    .get(function(req, res) {
    
        Mirror.findById(req.params.user_id, function(err, mirror) {
            if (err)
                res.send(err);
            res.json(mirror);
        });
    
    })
    
    .delete(function(req, res) {
        
        Mirror.remove({
			_id: req.params.user_id
		}, function(err, mirror) {
			if (err)
				res.send(err);

			res.json({ message: 'DELETE Successful' });
		});  
    })
    
    .put(function(req, res) {
       
		Mirror.findById(req.params.user_id, function(err, mirror) {

			if (err)
				res.send(err);
            
            var arr = {};

            for(var i in req.body)
            {
                console.log(req.body[i]);
                arr[i] = req.body[i];
            }
            
			mirror.json = arr;

			// save the bear
			mirror.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'UPDATE Successful!' });
			});

		});
 
    });
};