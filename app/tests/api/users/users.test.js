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
			  "password":"from_postman",
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
                chaiExpect(res.body.status).to.eql(serverJSON.api.users.successes._1.status);

                done();
            });
        });

    it('POST: check if creation of user fails if user is added twice', function(done) {
        superagent.post('http://localhost:3000/api/users')
            .send({
              "password":"from_postman",
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
                chaiExpect(res.body).to.eql('Username already exist');

                done();
            });
        });


    it('POST: check if deletion of user works when sent the required parameters', function(done) {
        superagent.del('http://localhost:3000/api/users/PostMan1')
            .end(function(e,res){
                console.log(e);
                chaiExpect(e).to.eql(null);
                console.log(res.body);
                chaiExpect(res.body.status).to.eql(serverJSON.api.users.successes._1.status);

                done();
            });
        });
});