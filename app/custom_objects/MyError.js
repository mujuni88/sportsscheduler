'use strict';

var MyError = function() {
    
    //MUST BE STRING
    this.clientMessage = ''; 

    //MUST BE OBJECT
    this.data = {};
};

module.exports = MyError;