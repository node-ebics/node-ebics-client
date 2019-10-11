'use strict';

module.exports = document => ({
	version: 'h004',
	orderDetails: { OrderType: 'CDS', OrderAttribute: 'OZHNN', StandardOrderParams: {} },
	operation: 'upload',
	document,
});
