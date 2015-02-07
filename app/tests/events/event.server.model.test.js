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
	serverJSON = require('../../local_files/ui/server.ui.json');

/**
 * Globals
 */
var user, eventModel;

/**
 * Unit tests
 */
describe('Event Model Unit Tests:', function() {
	
	var groupId = null;
	var id = null;
	before(function(done) {
		superagent.post('http://localhost:3000/api/users/groups')
	        .send({
			  name: 'Event Model Unit Test Group'
			})
	        .end(function(e,res){
	   
	            groupId = res.body.data._id;
	            console.log('created Group ID: ' + groupId);
	            done();
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
				group: groupId
			})
	        .end(function(e,res){
	            console.log(e);
	            chaiExpect(e).to.eql(null);
	            console.log(res.body.data);
	            chaiExpect(typeof res.body.data).to.eql('object');
	            id = res.body.data._id;
	            console.log('created ID: ' + id);
	            done();
	        });
	    });

	it('PUT: check if updating an event works when req has the required parameters', function(done) {
		var name = 'PostMan Updated Event Name';
    	superagent.put('http://localhost:3000/api/users/groups/events/'+id)
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
	            console.log(res.body.data);
	            chaiExpect(typeof res.body.data).to.eql('object');
	            console.log('updated ID: ' + id);
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
	            console.log(res.body.data);
	            chaiExpect(typeof res.body.error).to.eql('object');

	            console.log('updated ID: ' + id);
	            done();
	        });
	    });

	it('DELETE: check if deletion of group works when sent the required parameters', function(done) {
        superagent.del('http://localhost:3000/api/users/groups/events/'+id)
            .end(function(e,res){
                console.log(e);
                chaiExpect(e).to.eql(null);
                console.log(res.body.data);
                chaiExpect(typeof res.body.data).to.eql('object');
                console.log('deleted ID: ' + id);
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
	            console.log(res.body.data);
	            chaiExpect(typeof res.body.error).to.eql('object');
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
	            console.log(res.body.data);
	            chaiExpect(typeof res.body.error).to.eql('object');
	            done();
	        });
	    });

	after(function(done) {
		superagent.del('http://localhost:3000/api/users/groups/'+groupId)
            .end(function(e,res){
                console.log('deleted ID: ' + groupId);
                done();
            });
	});
});