/*
'use strict';

var superagent = require('superagent');
var chaiExpect = require('chai').expect;

var Mirror = require('../models/Mirror');

describe('Mirror Model Unit Tests:', function() {
    var mirror = null;
    
	beforeEach(function(done) {
		mirror = new Mirror({
			email: 'treyqg15',
			phone: '6011111111'
		});

		mirror.save(function() {

			done();
		});
	});
    
    describe('Has Attribute Email', function() {
        it('Should have an attribute called Email', function(done) {
            console.log('email: ' + mirror.email);
            chaiExpect(mirror).to.have.property('email');

            
            done();
        });
    });
    
    describe('Email Attribute Not Empty', function() {
        it('Email Attribute should contain a value', function(done) {
            console.log('email: ' + mirror.email);
            chaiExpect(mirror).to.have.property('email').that.has.length.above(0);

            
            done();
        });
    });

    describe('Email Attribute Is String', function() {
        it('Email Attribute should be a String', function(done) {
            console.log('email: ' + mirror.email);
            chaiExpect(mirror).to.have.property('email').that.is.a('string');

            
            done();
        });
    });
        
    afterEach(function(done) {
		Mirror.remove().exec();
		done();
	});
});

describe('AJAX Requests', function() {
    
    describe('POST Requests',function(done) {
        it('POST: create new object', function(done) {
        superagent.post('http://localhost:3000/test/')
            .send({ 
                name: 'John',
                email: 'john@rpjs.co'
            })
            .end(function(e,res){
                console.log(e);
                chaiExpect(e).to.eql(null);
                console.log(res.body);
                
                
                done();
            });
        });
    });
    
    describe('GET Requests',function(done) {
        var id = null;
        
        it('GET: retrieves all test objects', function(done){
            superagent.get('http://localhost:3000/test/')
              .end(function(e, res){
                console.log(e);
                chaiExpect(e).to.eql(null);
                console.log(res.body);
                chaiExpect(typeof res.body).to.eql('object');
                id = res.body[0]._id;

                done();
              });
        });
        
        it('GET: retrieve object with ID', function(done){
           superagent.get('http://localhost:3000/test/'+id)
           .end(function(e, res){
               
               console.log(e);
               chaiExpect(e).to.eql(null);
               console.log(res.body);
               chaiExpect(typeof res.body).to.eql('object');
               
               done();
           });
        });
    });
});
*/