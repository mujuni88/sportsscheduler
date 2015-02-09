'use strict';

var superagent = require('superagent');
var chaiExpect = require('chai').expect;
var serverJSON = require('../../../local_files/ui/server.ui.json');

describe('Carrier Unit Tests', function() {

	it('GET: check if requesting for all carriers returns successful', function(done) {
		superagent.get('http://localhost:3000/api/carriers')
          .end(function(e, res){
            console.log(e);
            chaiExpect(e).to.eql(null);

            chaiExpect(typeof res.body.data).to.eql('object');

            done();
        });
    });

    it('GET: check if requesting for all carriers in all countries returns successful', function(done) {
        superagent.get('http://localhost:3000/api/carriers/countries')
          .end(function(e, res){
            console.log(e);
            chaiExpect(e).to.eql(null);

            chaiExpect(typeof res.body.data).to.eql('object');

            done();
        });
    });

	it('GET: check if requesting for all carriers in a country returns successful', function(done) {
		superagent.get('http://localhost:3000/api/carriers/countries/us/')
          .end(function(e, res){
            console.log(e);
            chaiExpect(e).to.eql(null);
            chaiExpect(typeof res.body.data).to.eql('object');

            done();
      	});
    });

	it('GET: check if requesting for a specific carrier in a country returns successful', function(done) {
		superagent.get('http://localhost:3000/api/carriers/countries/us/carrier/at_and_t')
          .end(function(e, res){
            console.log(e);
            chaiExpect(e).to.eql(null);

            chaiExpect(typeof res.body.data).to.eql('object');

            done();
  	    });
    });

    it('GET: check if requesting for an invalid country fails properly', function(done) {
        superagent.get('http://localhost:3000/api/carriers/countries/usa')
          .end(function(e, res){
            console.log(e);
            chaiExpect(e).to.eql(null);

            chaiExpect(typeof res.body.error).to.eql('object');
            
            done();
        });
    });

    it('GET: check if requesting for an invalid carrier in a country fails properly', function(done) {
        superagent.get('http://localhost:3000/api/carriers/countries/us/carrier/at_and_')
          .end(function(e, res){
            console.log(e);
            chaiExpect(e).to.eql(null);

            chaiExpect(typeof res.body.error).to.eql('object');

            done();
        });
    });

    it('GET: check if requesting for an valid carrier in an invalid country fails properly', function(done) {
        superagent.get('http://localhost:3000/api/carriers/countries/usa/carrier/at_and_t')
          .end(function(e, res){
            console.log(e);
            chaiExpect(e).to.eql(null);

            chaiExpect(typeof res.body.error).to.eql('object');

            done();
        });
    });
});