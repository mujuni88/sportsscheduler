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
	serverJSON = require('../../../local_files/ui/server.ui.json');

/**
 * Globals
 */
var user, group;

/**
 * Unit tests
 */
describe('Group Model Unit Tests:', function() {
	var id = null;
	beforeEach(function(done) {
		// user = new User({
		// 	firstName: 'Full',
		// 	lastName: 'Name',
		// 	displayName: 'Full Name',
		// 	email: 'test@test.com',
		// 	username: 'username',
		// 	password: 'password'
		// });

		// user.save(function() { 
		// 	group = new Group({
		// 		name: 'Group Name',
		// 		user: user
		// 	});

		// 	done();
		// });
		done();
	});

	it('POST: check if creation of group works when req has the required parameters', function(done) {
    	superagent.post('http://localhost:3000/api/users/groups')
	        .send({
			  name: 'PostGroup'
			})
	        .end(function(e,res){
	            console.log(e);
	            chaiExpect(e).to.eql(null);
	            console.log(res.body);
	            chaiExpect(res.body.status).to.eql(serverJSON.api.users.groups.successes._1.status);
	            id = res.body.data._id;
	            console.log('created ID: ' + id);
	            done();
	        });
	    });

	it('PUT: check if updating a group works when req has the required parameters', function(done) {
		var name = 'UpdatedPostGroup';
    	superagent.put('http://localhost:3000/api/users/groups')
	        .send({
	        	id: id,
			  	name: name
			})
	        .end(function(e,res){
	            console.log(e);
	            chaiExpect(e).to.eql(null);
	            console.log(res.body);
	            chaiExpect(res.body.status).to.eql(serverJSON.api.users.groups.successes._1.status);
	            chaiExpect(res.body.data.name).to.eql(name);
	            console.log('updated ID: ' + id);
	            done();
	        });
	    });

	it('PUT: updating a group should fail when id does not exist in DB', function(done) {
		var name = 'UpdatedPostGroup';

    	superagent.put('http://localhost:3000/api/users/groups')
	        .send({
	        	id: -108309842,
			  	name: name
			})
	        .end(function(e,res){
	            console.log(e);
	            chaiExpect(e).to.eql(null);
	            console.log(res.body);
	            chaiExpect(res.body).to.be.empty;

	            console.log('updated ID: ' + id);
	            done();
	        });
	    });

	it('DELETE: check if deletion of group works when sent the required parameters', function(done) {
        superagent.del('http://localhost:3000/api/users/groups/'+id)
            .end(function(e,res){
                console.log(e);
                chaiExpect(e).to.eql(null);
                console.log(res.body);
                chaiExpect(res.body._id).to.not.eql(null);
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
	            chaiExpect(res.body).to.eql(serverJSON.api.users.groups.errors._1.clientMessage);
	            done();
	        });
	    });

	it('POST: should be able to show an error when saving with an invalid group name', function(done) { 
		superagent.post('http://localhost:3000/api/users/groups')
	        .send({
			  name: 'sdfss/d;\'"fdf@'
			})
	        .end(function(e,res){
	            console.log(e);
	            chaiExpect(e).to.eql(null);
	            console.log(res.body);
	            chaiExpect(res.body).to.eql(serverJSON.api.users.groups.errors._2.clientMessage);
	            done();
	        });
	    });
});