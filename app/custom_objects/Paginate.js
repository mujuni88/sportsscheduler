'use strict';

var _ = require('lodash');

var Paginate = function() {

	this.metadata = undefined;
};

Paginate.prototype.setMetadata = function(opt) {

	this.metadata = {

		count: opt.count

	};
};

module.exports = Paginate;