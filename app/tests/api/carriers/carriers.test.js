'use strict';

var superagent = require('superagent');
var chaiExpect = require('chai').expect;
var serverJSON = require('../../../local_files/ui/server.ui.json');

describe('GET Requests', function() {

	it('GET: check if requesting for all carriers returns successful', function(done) {
		superagent.get('http://localhost:3000/api/carriers')
          .end(function(e, res){
            console.log(e);
            chaiExpect(e).to.eql(null);

            chaiExpect(typeof res.body.data).to.eql('object');
            chaiExpect(res.body.status).to.eql(200);

            done();
        });
    });

	it('GET: check if requesting for all carriers in a country returns successful', function(done) {
		superagent.get('http://localhost:3000/api/carriers/countries/us/')
          .end(function(e, res){
            console.log(e);
            chaiExpect(e).to.eql(null);
            chaiExpect(typeof res.body.data).to.eql('object');
            chaiExpect(res.body.status).to.eql(200);

            done();
      	});
    });

	it('GET: check if requesting for a specific carrier in a country returns successful', function(done) {
		superagent.get('http://localhost:3000/api/carriers/countries/us/carrier/at_and_t')
          .end(function(e, res){
            console.log(e);
            chaiExpect(e).to.eql(null);

            chaiExpect(typeof res.body.data).to.eql('object');
            chaiExpect(res.body.status).to.eql(200);

            done();
  	    });
    });

    it('GET: check if requesting for an invalid country fails properly', function(done) {
        superagent.get('http://localhost:3000/api/carriers/countries/usa')
          .end(function(e, res){
            console.log(e);
            chaiExpect(e).to.eql(null);

            chaiExpect(res.body.clientMessage).to.eql(serverJSON.api.carriers.errors._1.clientMessage);
            chaiExpect(res.body.status).to.eql(400);

            done();
        });
    });

    it('GET: check if requesting for an invalid carrier in a country fails properly', function(done) {
        superagent.get('http://localhost:3000/api/carriers/countries/us/carrier/at_and_')
          .end(function(e, res){
            console.log(e);
            chaiExpect(e).to.eql(null);

            chaiExpect(res.body.clientMessage).to.eql(serverJSON.api.carriers.errors._2.clientMessage);
            chaiExpect(res.body.status).to.eql(400);

            done();
        });
    });

    it('GET: check if requesting for an valid carrier in an invalid country fails properly', function(done) {
        superagent.get('http://localhost:3000/api/carriers/countries/usa/carrier/at_and_t')
          .end(function(e, res){
            console.log(e);
            chaiExpect(e).to.eql(null);

            chaiExpect(res.body.clientMessage).to.eql(serverJSON.api.carriers.errors._1.clientMessage);
            chaiExpect(res.body.status).to.eql(400);

            done();
        });
    });
});