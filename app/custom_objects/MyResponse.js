'use strict';

var MyError = require('./MyError');

var MyResponse = function() {
    
    this.data = {};
    this.clientMessage = '';
    this.error = new MyError();
};

module.exports = MyResponse;