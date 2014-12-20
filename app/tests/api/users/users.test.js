'use strict';

var superagent = require('superagent');
var chaiExpect = require('chai').expect;
var serverJSON = require('../../../local_files/ui/server.ui.json');
var mongoose = require('mongoose');
var User = mongoose.model('User');

describe('POST Requests', function() {


	it('POST: check if creation of user works when sent the required parameters', function(done) {
        superagent.post('http://localhost:3000/api/users')
            .send({
			  "password":"Password123",
			  "email":"postman@postman.com",
			  "lastName":"man",
			  "firstName":"post",
			  "username":"PostMan1",
			  "carrier":"postT&T",
			  "phoneNumber":"6018801788"
			})
            .end(function(e,res){
                console.log(e);
                chaiExpect(e).to.eql(null);
                console.log(res.body);
                chaiExpect(typeof res.body.data).to.eql('object');

                done();
            });
        });

    it('POST: check if creation of user fails if user is added twice', function(done) {
        superagent.post('http://localhost:3000/api/users')
            .send({
              "password":"Password1",
              "email":"postman@postman.com",
              "lastName":"man",
              "firstName":"post",
              "username":"PostMan1",
              "carrier":"postT&T",
              "phoneNumber":"6018801788"
            })
            .end(function(e,res){
                console.log(e);
                chaiExpect(e).to.eql(null);
                console.log(res.body);
                chaiExpect(typeof res.body.error).to.eql('object');

                done();
            });
        });


    it('POST: check if deletion of user works when sent the required parameters', function(done) {
        superagent.del('http://localhost:3000/api/users/PostMan1')
            .end(function(e,res){
                console.log(e);
                chaiExpect(e).to.eql(null);
                console.log(res.body);
                chaiExpect(typeof res.body.data).to.eql('object');

                done();
            });
        });
});