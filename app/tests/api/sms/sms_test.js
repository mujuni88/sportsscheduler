'use strict';

var superagent = require('superagent');
var chaiExpect = require('chai').expect;

/*
describe('GET Requests', function() {
	it('GET: retrieves all test objects', function(done){
		superagent.get('http://localhost:3000/api/sms')
          .end(function(e, res){
            console.log(res.body);
            chaiExpect(e).to.eql(null);
            chaiExpect(typeof res.body).to.eql('object');
            //id = res.body[0]._id;

            done();
          });
      });
});
*/

describe('POST Requests', function() {
	it('POST: check if sms is sent when req has the required parameters', function(done) {
        superagent.post('http://localhost:3000/api/sms')
            .send({ 
                to: '6018801788@cspire1.com',
                subject: 'SMS Test',
                text: 'This is a message from sms_test.js for unit testing. Checking if sms is sent when req has the required parameters'
            })
            .end(function(e,res){
                console.log(res.body);
                chaiExpect(e).to.eql(null);
                chaiExpect(res.body.clientMessage).to.eql('SMS Sent Successfully');
                chaiExpect(res.body.error.clientMessage).to.eql('');
                done();
            });
        });

    it('POST: check if sending an sms fails when req is missing required parameters ("to" in this case)', function(done) {
        superagent.post('http://localhost:3000/api/sms')
            .send({ 
                //from: 'treyqg15@gmail.com',
                //to: '6018801788@cspire1.com',
                subject: 'SMS Test',
                text: 'This is a message from sms_test.js for unit testing. check if sending an sms fails when req is missing required parameters ("to" in this case)'
            })
            .end(function(e,res){
                console.log(res.body);
                chaiExpect(e).to.eql(null);
                chaiExpect(res.body.error.clientMessage).to.eql('Missing "to" parameter in request');
                done();
            });
        });
    
    /*
    it('POST: check if sending an sms succeeds when sending to multiple people', function(done) {
        superagent.post('http://localhost:3000/api/sms')
            .send({ 
                //from: 'treyqg15@gmail.com',
                to: '6018801788@cspire1.com 7692307747@cspire1.com',
                subject: 'SMS Test',
                text: 'This is a message from sms_test.js for unit testing. check if sending an sms succeeds when sending to multiple people'
            })
            .end(function(e,res){
                console.log(res.body);
                chaiExpect(e).to.eql(null);
                chaiExpect(res.body.clientMessage).to.eql('SMS Sent Successfully');
                chaiExpect(res.body.error.clientMessage).to.eql('');
                done();
            });
        });
    */
});