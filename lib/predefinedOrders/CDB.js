'use strict';

module.exports = document => ({
	version: 'h004',
	orderDetails: { OrderType: 'CDB', OrderAttribute: 'OZHNN', StandardOrderParams: {} },
	operation: 'upload',
	document,
});
