'use strict';

var MyResponse = require('../../../custom_objects/MyResponse');
var serverJSON = require('../../../local_files/ui/server.ui.json');
var smsJSON = require('../../../local_files/ui/sms.ui.json');

module.exports = function(app) {

app.route('/api/file/sms')

	.get(function(req, res) {
    	
        var myResponse = new MyResponse();
        var carriers = [];
        console.log('serverJSON: ' + smsJSON.sms);
        
        for(var country in smsJSON.sms.sms_carriers)
        {
            var country = smsJSON.sms.sms_carriers[country];

            for(var carrier in country)
            {
                var carrierInfo = country[carrier];
                var name = carrierInfo[0];
                var address = carrierInfo[1];

                if(typeof address != 'undefined')
                {
                    address = address.replace('{number}','');
                    carriers.push({
                        'carrier': name,
                        'addr': address
                    });
                }
            }
        }

        myResponse.data = carriers;
        
        res.json(myResponse);
    });

};