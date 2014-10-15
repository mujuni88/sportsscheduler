'use strict';

var MyResponse = require('../../../custom_objects/MyResponse');
var serverJSON = require('../../../local_files/ui/server.ui.json');
var smsJSON = require('../../../local_files/ui/sms.ui.json');

function formatCarrierInfo(carrierInfo) 
{
	var name = carrierInfo[0];
    var address = carrierInfo[1];
	var address = address.replace('{number}','');

	return {
        	'carrier': name,
        	'addr': address
    };
}

module.exports = function(app) {

app.route('/api/carriers')

	.get(function(req, res) {
    	
        var myResponse = new MyResponse();
        var carriersArr = [];
        console.log('smsJSON: ' + smsJSON.sms);
        
        for(var carriers in smsJSON.sms.sms_carriers)
        {
            var country = smsJSON.sms.sms_carriers[carriers];

            for(var carrier in country)
            {
                var carrierInfo = country[carrier];
                var address = carrierInfo[1];

                if(typeof address !== 'undefined')
                {
                    carriersArr.push(formatCarrierInfo(carrierInfo));
                }
            }
        }

        myResponse.data = carriersArr;
        
        res.json(myResponse);
    });

app.route('/api/carriers/countries/:countryName')

	.get(function(req, res) {

		var myResponse = new MyResponse();
        console.log('smsJSON: ' + smsJSON.sms);
       
        var country = smsJSON.sms.sms_carriers[req.params.countryName];
        var formattedData = {};
        

        for(var carrier in country)
        {
        	formattedData[carrier] = formatCarrierInfo(country[carrier]);
        }

        myResponse.data = formattedData;

        res.json(myResponse);

	});


app.route('/api/carriers/countries/:countryName/carrier/:carrierName')

	.get(function(req, res) {

		var myResponse = new MyResponse();
        var carrierInfo = smsJSON.sms.sms_carriers[req.params.countryName][req.params.carrierName];
        var carrier = formatCarrierInfo(carrierInfo);

        myResponse.data = carrier;

        res.json(myResponse);

	});
};