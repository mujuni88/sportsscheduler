'use strict';

var superagent = require('superagent');
var chaiExpect = require('chai').expect;
var serverJSON = require('../../../local_files/ui/server.ui.json');

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

describe('SMS Unit Tests', function() {

	it('POST: check if sms is sent when req has the required parameters', function(done) {
        superagent.post('http://localhost:3000/api/sms')
            .send({
                to: '6018801788@cspire1.com',
                subject: 'SMS Test',
                text: 'This is a message from sms_test.js for unit testing. Checking if sms is sent when req has the required parameters'
            })
            .end(function(e,res){
                console.log(e);
                chaiExpect(e).to.eql(null);
                chaiExpect(res.statusCode).to.eql(200);
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
                console.log(e);
                chaiExpect(e).to.eql(null);
                console.log(res.body);
                chaiExpect(res.statusCode).to.eql(400);

                done();
            });
        });

    it('POST: throw an error if "to" parameter is in an incorrect format. Test case: 6018a801788@cspire1.com', function(done) {
        superagent.post('http://localhost:3000/api/sms')
            .send({ 
                //from: 'treyqg15@gmail.com',
                to: '6018a801788@cspire1.com',
                subject: 'SMS Test',
                text: 'This is a message from sms_test.js for unit testing. check if "to" parameter is in the correct format'
            })
            .end(function(e,res){
                console.log(e);
                chaiExpect(e).to.eql(null);
                console.log(res.body);
                chaiExpect(res.statusCode).to.eql(400);

                done();
            });
        });

    it('POST: check if "to" parameter is in the correct format. Test case: 6018a801788 cspire1.com', function(done) {
        superagent.post('http://localhost:3000/api/sms')
            .send({ 
                //from: 'treyqg15@gmail.com',
                to: '6018a801788 cspire1.com',
                subject: 'SMS Test',
                text: 'This is a message from sms_test.js for unit testing. check if "to" parameter is in the correct format'
            })
            .end(function(e,res){
                console.log(e);
                chaiExpect(e).to.eql(null);
                console.log(res.body);
                chaiExpect(res.statusCode).to.eql(400);
                done();
            });
        });

    it('POST: check if "to" parameter is in the correct format. Test case: 6018a801788@cspire 1 . com', function(done) {
        superagent.post('http://localhost:3000/api/sms')
            .send({ 
                //from: 'treyqg15@gmail.com',
                to: '6018a801788@cspire 1 . com',
                subject: 'SMS Test',
                text: 'This is a message from sms_test.js for unit testing. check if "to" parameter is in the correct format'
            })
            .end(function(e,res){
                console.log(e);
                chaiExpect(e).to.eql(null);
                console.log(res.body);
                chaiExpect(res.statusCode).to.eql(400);
                
                done();
            });
        });

    it('POST: check if "subject" parameter exists', function(done) {
        superagent.post('http://localhost:3000/api/sms')
            .send({ 
                //from: 'treyqg15@gmail.com',
                to: '6018801788@cspire1.com',
                //subject: 'SMS Test',
                text: 'This is a message from sms_test.js for unit testing. check if "subject" parameter exists'
            })
            .end(function(e,res){
                console.log(e);
                chaiExpect(e).to.eql(null);
                console.log(res.body);
                chaiExpect(res.statusCode).to.eql(400);
                
                done();
            });
        });

    it('POST: check if "text" parameter exists', function(done) {
        superagent.post('http://localhost:3000/api/sms')
            .send({ 
                //from: 'treyqg15@gmail.com',
                to: '6018801788@cspire1.com',
                subject: 'SMS Test',
                //text: 'This is a message from sms_test.js for unit testing. check if "text" parameter exists'
            })
            .end(function(e,res){
                console.log(e);
                chaiExpect(e).to.eql(null);
                console.log(res.body);
                chaiExpect(res.statusCode).to.eql(400);
                
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