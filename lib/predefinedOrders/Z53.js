'use strict';

const utils = require('../consts');

module.exports = (start = null, end = null) => ({
	version: 'h004',
	orderDetails: {
		OrderType: 'Z53',
		OrderAttribute: 'DZHNN',
		StandardOrderParams: utils.dateRange(start, end),
	},
	operation: 'download',
});
