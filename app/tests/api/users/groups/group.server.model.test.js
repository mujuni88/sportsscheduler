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
	var groupID = null;
	var userID = null;
	var username = 'unittest';

	before(function(done) {
		
		superagent.post('http://localhost:3000/api/users')
			.send({
				carrier: '@sms.alltelwireless.com',
				email: 'treyqg15@gmail.com',
				firstName: 'Trey',
				lastName: 'Gaines',
				password: 'Password1',
				phoneNumber: '6018801788',
				username: username,
			})
			.end(function(e,res){
				userID = res.body._id;
				done();
			});
	});

	it('POST: check if creation of group works when req has the required parameters', function(done) {
    	superagent.post('http://localhost:3000/api/users/groups')
	        .send({
			  name: 'Unit Test Group',
			  createdBy: userID,
			  admins: [userID]
			})
	        .end(function(e,res){
	            console.log(e);
	            chaiExpect(e).to.eql(null);
	            chaiExpect(res.statusCode).to.eql(200);
	            groupID = res.body._id;
	            console.log('created groupID: ' + groupID);
	            done();
	        });
	    });

	it('PUT: check if updating a group works when req has the required parameters', function(done) {
		var name = 'UpdatedPostGroup';
    	superagent.put('http://localhost:3000/api/users/groups/'+groupID)
    		.send({
    			name: name
    		})
	        .end(function(e,res){
	            console.log(e);
	            chaiExpect(e).to.eql(null);
	            chaiExpect(res.statusCode).to.eql(200);
	            console.log('updated groupID: ' + groupID);
	            done();
	        });
	    });

	it('PUT: updating a group should fail when id does not exist in DB', function(done) {
		var name = 'UpdatedPostGroup';

    	superagent.put('http://localhost:3000/api/users/groups/-1')
	        .end(function(e,res){
	            console.log(e);
	            chaiExpect(e).to.eql(null);
	            chaiExpect(res.statusCode).to.eql(400);

	            done();
	        });
	    });

	it('DELETE: check if deletion of group works when sent the required parameters', function(done) {
        superagent.del('http://localhost:3000/api/users/groups/'+groupID)
            .end(function(e,res){
                console.log(e);
                chaiExpect(e).to.eql(null);
                chaiExpect(res.statusCode).to.eql(200);
                console.log('deleted ID: ' + groupID);

                done();
            });
        });
    

	it('POST: should be able to show an error when try to save without name', function(done) { 
		superagent.post('http://localhost:3000/api/users/groups')
	        .send({
			  name: '',
			  createdBy: userID,
			  admins: [userID]
			})
	        .end(function(e,res){
	            console.log(e);
	            chaiExpect(e).to.eql(null);
	            chaiExpect(res.statusCode).to.eql(400);
	            done();
	        });
	    });

	it('POST: should be able to show an error when saving with an invalid group name', function(done) { 
		superagent.post('http://localhost:3000/api/users/groups')
	        .send({
			  name: 'sdfss/d;"fdf@',
			  createdBy: userID,
			  admins: [userID]
			})
	        .end(function(e,res){
	            console.log(e);
	            chaiExpect(e).to.eql(null);
	            chaiExpect(res.statusCode).to.eql(400);
	            done();
	        });
	    });

	after(function(done) {
		superagent.del('http://localhost:3000/api/users/'+username)
            .end(function(e,res){
                console.log('deleted username: ' + username);

		        done();
		    });
	});
});