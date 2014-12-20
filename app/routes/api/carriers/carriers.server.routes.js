'use strict';

var MyResponse = require('../../../custom_objects/MyResponse');
var serverJSON = require('../../../local_files/ui/server.ui.json');
var smsJSON = require('../../../local_files/ui/sms.ui.json');



function formatCarrierInfo(carrierInfo) 
{
	var name = carrierInfo[0];
    var address = carrierInfo[1];
	address = address.replace('{number}','');

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
        
        for(var country in smsJSON.sms.sms_carriers)
        {
            var carriers = smsJSON.sms.sms_carriers[country];

            for(var carrier in carriers)
            {
                var carrierInfo = carriers[carrier];
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

app.route('/api/carriers/countries')

    .get(function(req, res) {

        var myResponse = new MyResponse();
        var countries = {};

        for(var country in smsJSON.sms.sms_carriers)
        {
            var carriersArr =  [];
            countries[country] = {};
            var carriers = smsJSON.sms.sms_carriers[country];
            
            for(var carrier in carriers)
            {
                var carrierInfo = carriers[carrier];
                var address = carrierInfo[1];

                if(typeof address !== 'undefined')
                {
                    carriersArr.push(formatCarrierInfo(carrierInfo));
                }
            }

            countries[country].carriers = carriersArr;

        }

        myResponse.data = countries;

        res.json(myResponse);
    });

app.route('/api/carriers/countries/:countryName')

	.get(function(req, res) {

        var myResponse = new MyResponse();
        var country = smsJSON.sms.sms_carriers[req.params.countryName];
        var carrierArr = [];

        if(typeof country === 'undefined')
        {
            myResponse.setError(serverJSON.api.carriers.countries.invalid);
            res.json(myResponse);
            return;
        }

        for(var carrier in country)
        {
        	carrierArr.push(formatCarrierInfo(country[carrier]));
        }

        myResponse.data = carrierArr;

        res.json(myResponse);

	});


app.route('/api/carriers/countries/:countryName/carrier/:carrierName')

	.get(function(req, res) {

        var myResponse = new MyResponse();
        var countryCarriers = smsJSON.sms.sms_carriers[req.params.countryName];

        if(typeof countryCarriers === 'undefined')
        {
            myResponse.setError(serverJSON.api.carriers.countries.carriers.invalid);
            res.json(myResponse);
            return;
        }

        var carrierInfo = countryCarriers[req.params.carrierName];

        if(typeof carrierInfo === 'undefined')
        {
            myResponse.setError(serverJSON.api.carriers.countries.invalid);
            res.json(myResponse);
            return;
        }

        var carrier = formatCarrierInfo(carrierInfo);

        myResponse.data = carrier;

        res.json(myResponse);

	});
};