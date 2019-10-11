'use strict';

module.exports = document => ({
	version: 'h004',
	orderDetails: { OrderType: 'CDD', OrderAttribute: 'OZHNN', StandardOrderParams: {} },
	operation: 'upload',
	document,
});
