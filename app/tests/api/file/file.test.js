'use strict';

var superagent = require('superagent');
var chaiExpect = require('chai').expect;
var serverJSON = require('../../../local_files/ui/server.ui.json');

describe('GET Requests', function() {

	var fileJSON = null;

    beforeEach(function(done) {
        
    	fileJSON = serverJSON.api.file;
    	done();
    });

	it('GET: check if appJSON file gets sent to client', function(done) {
        superagent.get('http://localhost:3000/api/file/sms')
          .end(function(e, res){
            console.log(e);
            chaiExpect(e).to.eql(null);

            chaiExpect(typeof res.body).to.eql('object');

            done();
          });
        });
});