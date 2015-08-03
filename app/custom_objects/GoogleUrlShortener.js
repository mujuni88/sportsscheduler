"use strict";

var config = require('../../config/config'),
     google = require('googleapis'),
     urlshortener = google.urlshortener('v1'),
     _ = require('lodash');

// var params = { longUrl: 'http://goo.gl/xKbRu3' };
exports.shorten = function(longUrl, callback){
    
    var params = {
        resource: {
            longUrl: longUrl 
        },
        key:config.google.apiKey
    };
    
    urlshortener.url.insert(params, function (err, response) {
        if (err) {
            console.log('Encountered error', err);
        } else {
            console.log('Url shortener ', response);
        }
        callback(err, response);
    });
};
