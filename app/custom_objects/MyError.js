'use strict';

var MyError = function() {
    
    //MUST BE STRING
    this.clientMessage = ''; 

    //MUST BE OBJECT
    this.data = {};

    this.status = null;
};

module.exports = MyError;