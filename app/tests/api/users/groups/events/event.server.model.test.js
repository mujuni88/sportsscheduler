'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Group = mongoose.model('Group'),
	EventModel = mongoose.model('Event'),
	superagent = require('superagent'),
	chaiExpect = require('chai').expect,
	serverJSON = require('../../../../../local_files/ui/server.ui.json');

/**
 * Globals
 */
var user, eventModel;

/**
 * Unit tests
 */
describe('Event Model Unit Tests:', function() {
	
	var groupID = null;
	var eventID = null;
	var memberID = null;
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
				console.log('userID: ' + userID);
				superagent.post('http://localhost:3000/api/users/groups')
			        .send({
					  name: 'Event Model Unit Test Group',
					  admins: [userID],
					  createdBy: userID
					})
			        .end(function(e,res){
			   			console.log(res.body);
			            groupID = res.body._id;
			            console.log('created Group ID: ' + groupID);
			            done();
	        		});
			});
	});

	it('POST: check if creation of event works when req has the required parameters', function(done) {
    	superagent.post('http://localhost:3000/api/users/groups/events')
	        .send({
			 	name: 'PostMan Event Name',
			  	location: {
			    	address: 'address'
			  	},
			  	date: '2014-11-19T19:33:00.243Z',
				message: 'w',
				minVotes: 0,
				minimumVotes: 5,
				time: '2014-11-19T21:33:00.244Z',
				voteEnabled: true,
				group: groupID
			})
	        .end(function(e,res){
	            console.log(e);
	            chaiExpect(e).to.eql(null);
	            chaiExpect(res.statusCode).to.eql(200);
	            eventID = res.body._id;
	            console.log('created eventID: ' + eventID);
	            done();
	        });
	    });

	it('PUT: check if updating an event works when req has the required parameters', function(done) {
		var name = 'PostMan Updated Event Name';
    	superagent.put('http://localhost:3000/api/users/groups/events/'+eventID)
	        .send({
	        	name: name,
			  	location: {
			    	address: 'address2'
			  	},
			  	date: '2014-11-19T19:33:00.243Z',
				message: 'w',
				minVotes: 0,
				minimumVotes: 5,
				time: '2014-11-19T21:33:00.244Z',
				voteEnabled: true
			})
	        .end(function(e,res){
	            console.log(e);
	            chaiExpect(e).to.eql(null);
	            chaiExpect(res.statusCode).to.eql(200);
	            console.log('updated eventID: ' + eventID);
	            done();
	        });
	    });

	it('PUT: updating an event should fail when id does not exist in DB', function(done) {
    	superagent.put('http://localhost:3000/api/users/groups/events/-108309842')
	        .send({
	        	name: 'PostMan Event Name',
			  	location: {
			    	address: 'add'
			  	},
			  	date: '2014-11-19T19:33:00.243Z',
				message: 'w',
				minVotes: 0,
				minimumVotes: 5,
				time: '2014-11-19T21:33:00.244Z',
				voteEnabled: true
			})
	        .end(function(e,res){
	            console.log(e);
	            chaiExpect(e).to.eql(null);
	            chaiExpect(res.statusCode).to.eql(400);

	            done();
	        });
	    });

	it('DELETE: check if deletion of group works when sent the required parameters', function(done) {
        superagent.del('http://localhost:3000/api/users/groups/events/'+eventID)
            .end(function(e,res){
                console.log(e);
                chaiExpect(e).to.eql(null);
                chaiExpect(res.statusCode).to.eql(200);
                console.log('deleted eventID: ' + eventID);
                done();
            });
        });
    

	it('POST: should be able to show an error when try to save without name', function(done) {
		superagent.post('http://localhost:3000/api/users/groups/events')
	        .send({
			  name: ''
			})
	        .end(function(e,res){
	            console.log(e);
	            chaiExpect(e).to.eql(null);
	            
	            chaiExpect(res.statusCode).to.eql(400);
	            done();
	        });
	    });

	it('POST: should be able to show an error when saving with an invalid group name', function(done) { 
		superagent.post('http://localhost:3000/api/users/groups/events')
	        .send({
			  name: 'sdfss/d;fdf@'
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
            
				superagent.del('http://localhost:3000/api/users/groups/'+groupID)
		            .end(function(e,res){
		                console.log('deleted groupID: ' + groupID);
		                done();
		            });
		    });
	});
});