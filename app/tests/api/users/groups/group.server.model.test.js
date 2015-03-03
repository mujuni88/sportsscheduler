'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Group = mongoose.model('Group'),
	superagent = require('superagent'),
	chaiExpect = require('chai').expect,
	serverJSON = require('../../../../local_files/ui/server.ui.json');

/**
 * Globals
 */
var user, group;

/**
 * Unit tests
 */
describe('Group Model Unit Tests:', function() {
	var id = null;
	before(function(done) {
		// var user = new User({
		// 	password: "unittest",
		// 	email: "unittest@postman.com",
		// 	lastName: "test",
		// 	firstName: "unit",
		// 	username: "unittest",
		// 	carrier: "unittestT&T",
		// 	phoneNumber: "6018801788"
		// });

		// user.save(function() { 
			
		// 	done();
		// });
	});

	it('POST: check if creation of group works when req has the required parameters', function(done) {
    	superagent.post('http://localhost:3000/api/users/groups')
	        .send({
			  name: 'PostGroup'
			})
	        .end(function(e,res){
	            console.log(e);
	            chaiExpect(e).to.eql(null);
	            console.log(res.body.error);
	            chaiExpect(typeof res.body.data).to.eql('object');
	            id = res.body.data._id;
	            console.log('created ID: ' + id);
	            done();
	        });
	    });

	it('PUT: check if updating a group works when req has the required parameters', function(done) {
		var name = 'UpdatedPostGroup';
    	superagent.put('http://localhost:3000/api/users/groups/'+id)
	        .end(function(e,res){
	            console.log(e);
	            chaiExpect(e).to.eql(null);
	            console.log(res.body.data);
	            chaiExpect(typeof res.body.data).to.eql('object');
	            console.log('updated ID: ' + id);
	            done();
	        });
	    });

	it('PUT: updating a group should fail when id does not exist in DB', function(done) {
		var name = 'UpdatedPostGroup';

    	superagent.put('http://localhost:3000/api/users/groups/-1')
	        .end(function(e,res){
	            console.log(e);
	            chaiExpect(e).to.eql(null);
	            console.log(res.body.data);
	            chaiExpect(typeof res.body.error).to.eql('object');

	            done();
	        });
	    });

	it('DELETE: check if deletion of group works when sent the required parameters', function(done) {
        superagent.del('http://localhost:3000/api/users/groups/'+id)
            .end(function(e,res){
                console.log(e);
                chaiExpect(e).to.eql(null);
                console.log(res.body.data);
                chaiExpect(res.body.data._id).to.not.be.null;
                console.log('deleted ID: ' + id);
                done();
            });
        });
    

	it('POST: should be able to show an error when try to save without name', function(done) { 
		superagent.post('http://localhost:3000/api/users/groups')
	        .send({
			  name: ''
			})
	        .end(function(e,res){
	            console.log(e);
	            chaiExpect(e).to.eql(null);
	            console.log(res.body);
	            chaiExpect(typeof res.body.error).to.eql('object');
	            done();
	        });
	    });

	it('POST: should be able to show an error when saving with an invalid group name', function(done) { 
		superagent.post('http://localhost:3000/api/users/groups')
	        .send({
			  name: 'sdfss/d;"fdf@'
			})
	        .end(function(e,res){
	            console.log(e);
	            chaiExpect(e).to.eql(null);
	            console.log(res.body);
	            chaiExpect(typeof res.body.error).to.eql('object');
	            done();
	        });
	    });
});