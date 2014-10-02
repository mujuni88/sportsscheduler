'use strict';

var superagent = require('superagent');
var chaiExpect = require('chai').expect;

var MyResponse = require('../custom_objects/MyResponse');
var MyError = require('../custom_objects/MyError');

describe('MyResponse Custom Object Unit Tests:', function() {
    
    var response = null;
    
    
	beforeEach(function(done) {
		response = new MyResponse();
        response.json = {};
        response.error = new MyError();
        response.message = '';
        
		done();
		
	});
    
    describe('MyResponse Attribute Check', function() {
        it('Check if attributes are the correct types', function(done) {
            
            console.log('typeof response: ' + typeof response);
            chaiExpect(response.json).to.be.an('object');
            chaiExpect(response.error).to.be.an('object');
            chaiExpect(response.message).to.be.a('string');
            done();
        });
    });
});