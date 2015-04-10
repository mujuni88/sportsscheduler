'use strict';

var MyResponse = require('../../../custom_objects/MyResponse'),
    serverJSON = require('../../../local_files/ui/server.ui.json'),
    smsJSON = require('../../../local_files/ui/sms.ui.json'),
    Helper = require('../../../custom_objects/Helper');


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

        myResponse.setData(carriersArr);
        Helper.output(myResponse,res);
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

        myResponse.setData(countries);
        Helper.output(myResponse,res);
    });

app.route('/api/carriers/countries/:countryName')

	.get(function(req, res) {

        var myResponse = new MyResponse();
        var country = smsJSON.sms.sms_carriers[req.params.countryName];
        var carrierArr = [];

        if(typeof country === 'undefined')
        {
            myResponse.addMessages(serverJSON.api.carriers.countries.invalid);
            Helper.output(myResponse,res);

            return;
        }

        for(var carrier in country)
        {
        	carrierArr.push(formatCarrierInfo(country[carrier]));
        }

        myResponse.setData(carrierArr);
        Helper.output(myResponse,res);

	});


app.route('/api/carriers/countries/:countryName/carrier/:carrierName')

	.get(function(req, res) {

        var myResponse = new MyResponse();
        var countryCarriers = smsJSON.sms.sms_carriers[req.params.countryName];

        if(typeof countryCarriers === 'undefined')
        {
            myResponse.addMessages(serverJSON.api.carriers.carrier.invalid);
            Helper.output(myResponse,res);
         
            return;
        }

        var carrierInfo = countryCarriers[req.params.carrierName];

        if(typeof carrierInfo === 'undefined')
        {
            myResponse.addMessages(serverJSON.api.carriers.countries.invalid);
            Helper.output(myResponse,res);

            return;
        }

        var carrier = formatCarrierInfo(carrierInfo);

        myResponse.setData(carrier);
        Helper.output(myResponse,res);

	});
};