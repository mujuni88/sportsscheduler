'use strict';

var MyError = require('./MyError');

var MyResponse = function() {
    
    this.data = {};
    this.clientMessage = '';
    this.error = null;
};

module.exports = MyResponse;