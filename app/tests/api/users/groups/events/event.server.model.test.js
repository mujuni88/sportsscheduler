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
	serverJSON = require('../../../../../local_files/ui/server.ui.json'),
	async = require('async');

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
	var admin1ID = null;
	var admin2ID = null;
	var admin1Username = 'Admin1';
	var admin2Username = 'Admin2';
	var memberUsername = 'Member_User';

	before(function(done) {

		function createFirstAdmin(cb) {

			superagent.post('http://localhost:3000/api/users')
			.send({
				carrier: '@sms.alltelwireless.com',
				email: 'treyqg15@gmail.com',
				firstName: 'Admin1FirstName',
				lastName: 'Admin1LastName',
				password: 'Password1',
				phoneNumber: '6018801788',
				username: admin1Username
			})
			.end(function(e,res){
				
				admin1ID = res.body._id;
				console.log('admin1ID: ' + admin1ID);
				cb(null,admin1ID);
			});
		}


		function createSecondAdmin(admin1ID,cb) {
			
			superagent.post('http://localhost:3000/api/users')
			.send({
				carrier: '@sms.alltelwireless.com',
				email: 'treyqg15@gmail.com',
				firstName: 'Admin2FirstName',
				lastName: 'Admin2LastName',
				password: 'Password1',
				phoneNumber: '6018801788',
				username: admin2Username
			})
			.end(function(e,res){
				
				admin2ID = res.body._id;
				console.log('admin2ID: ' + admin2ID);
				cb(null,admin1ID,admin2ID);
			});
		}


		function createMemberUser(admin1ID,admin2ID,cb) {
			
			superagent.post('http://localhost:3000/api/users')
			.send({
				carrier: '@sms.alltelwireless.com',
				email: 'treyqg15@gmail.com',
				firstName: 'Member',
				lastName: 'User',
				password: 'Password1',
				phoneNumber: '6018801788',
				username: memberUsername
			})
			.end(function(e,res){
				
				memberID = res.body._id;
				console.log('memberID: ' + memberID);
				cb(null,admin1ID,admin2ID,memberID);
			});
		}


		function createGroup(admin1ID,admin2ID,memberID,cb) {

			superagent.post('http://localhost:3000/api/users/groups')
	        .send({
	        	name: 'Event Model Unit Test Group2',
				admins: [admin1ID,admin2ID],
				createdBy: admin1ID,
				members: [memberID]
			})
	        .end(function(e,res){
	   			console.log(res.body);
	            groupID = res.body._id;
	            console.log('created Group ID: ' + groupID);
	            cb(null);
    		});
		}

		async.waterfall([
			createFirstAdmin,
			createSecondAdmin,
			createMemberUser,
			createGroup
		],function(error,data) {
			done();
		});
	});
		/*
		superagent.post('http://localhost:3000/api/users')
			.send({
				carrier: '@sms.alltelwireless.com',
				email: 'treyqg15@gmail.com',
				firstName: 'Trey',
				lastName: 'Gaines',
				password: 'Password1',
				phoneNumber: '6018801788',
				username: username
			})
			.end(function(e,res){
				
				userID = res.body._id;
				console.log('userID: ' + userID);
				superagent.post('http://localhost:3000/api/users/groups')
			        .send({
			        	name: 'Event Model Unit Test Group2',
						admins: [userID,'550c9956e123ac57c99521f9'],
						createdBy: '550c9956e123ac57c99521f9',
						members: ['550c9956e123ac57c99521f9']
					})
			        .end(function(e,res){
			   			console.log(res.body);
			            groupID = res.body._id;
			            console.log('created Group ID: ' + groupID);
			            done();
	        		});
			});
		*/

	it('POST: check if creation of event works when req has the required parameters', function(done) {
    	superagent.post('http://localhost:3000/api/users/groups/'+groupID+'/events')
	        .send({
			 	name: 'PostMan Event Name',
			  	location: {
			    	address: 'address'
			  	},
			  	date: '2014-06-11T15:33:00.244Z',
				message: 'w',
				minVotes: 0,
				minimumVotes: 5,
				time: '2015-06-12T15:17:30.244Z',
				voteEnabled: true
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
			  	date: '2014-06-11T15:33:00.244Z',
				message: 'w',
				minVotes: 0,
				minimumVotes: 5,
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

	it('PUT: cast valid votes', function(done) {
    	superagent.put('http://localhost:3000/api/users/groups/events/'+eventID)
	        .send({
	        	votes: {
	        		yes: [
	        				{
	        					_id: memberID
	        				},
	        				{
	        					_id: admin1ID
	        				}
	        			],
	        		no: [
	        				{
	        					_id: admin2ID
	        				}
	        			]
	        	}
			})
	        .end(function(e,res){
	            console.log(e);
	            console.log(res.body);
	            chaiExpect(e).to.eql(null);
	            chaiExpect(res.statusCode).to.eql(200);

	            console.log('updated eventID: ' + eventID);
	            done();
	        });
	    });

	it('PUT: cast a vote for yes and no. Should return an error', function(done) {
    	superagent.put('http://localhost:3000/api/users/groups/events/'+eventID)
	        .send({
	        	votes: {
	        		yes: [
	        				{
	        					_id: memberID
	        				},
	        				{
	        					_id: admin1ID
	        				}
	        			],
	        		no: [
	        				{
	        					_id: memberID
	        				}
	        			]
	        	}
			})
	        .end(function(e,res){
	            console.log(e);
	            console.log(res.statusCode);
	            chaiExpect(e).to.eql(null);
	            chaiExpect(res.statusCode).to.eql(400);
	            console.log('updated eventID: ' + eventID);
	            done();
	        });
	    });
	it('PUT: cast a duplicate vote for yes. Should return an error', function(done) {
		superagent.put('http://localhost:3000/api/users/groups/events/'+eventID)
		.send({
			votes: {
        		yes: [
        				{
        					_id: memberID
        				},
        				{
        					_id: admin1ID
        				}
        			],
        		no: [
        				{
        					_id: admin2ID
        				}
        			]
        	}
		})
		.end(function(e,res){
            console.log(e);
            chaiExpect(e).to.eql(null);
            chaiExpect(res.statusCode).to.eql(400);
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
			  	date: '2014-06-11T15:33:00.244Z',
				message: 'w',
				minVotes: 0,
				minimumVotes: 5,
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
		superagent.post('http://localhost:3000/api/users/groups/'+groupID+'/events')
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
		superagent.post('http://localhost:3000/api/users/groups/'+groupID+'/events')
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

		function deleteAdmin1(cb) {

			superagent.del('http://localhost:3000/api/users/'+admin1Username)
            .end(function(e,res){
                console.log('deleted admin1Username: ' + admin1Username);
            
				cb(null);
		    });
		}

		function deleteAdmin2(cb) {

			superagent.del('http://localhost:3000/api/users/'+admin2Username)
            .end(function(e,res){
                console.log('deleted admin2Username: ' + admin2Username);
            
				cb(null);
		    });
		}

		function deleteMember(cb) {

			superagent.del('http://localhost:3000/api/users/'+memberUsername)
            .end(function(e,res){
                console.log('deleted memberUsername: ' + memberUsername);
            
				cb(null);
		    });
		}

		function deleteGroup(cb) {
			superagent.del('http://localhost:3000/api/users/groups/'+groupID)
            .end(function(e,res){
                console.log('deleted groupID: ' + groupID);
                done();
            });
		}

		async.waterfall([
			deleteAdmin1,
			deleteAdmin2,
			deleteMember,
			deleteGroup
		],function(error,data) {
			done();
		});
	});
});