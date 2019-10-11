'use strict';

const constants = require('../../consts');

const iniSerializer = require('./serializers/ini');
const downloadSerializer = require('./serializers/download');
const uploadSerializer = require('./serializers/upload');

module.exports = {
	use(order, client) {
		const operation = order.operation.toUpperCase();

		if (operation === constants.orderOperations.ini) return iniSerializer.use(order, client);
		if (operation === constants.orderOperations.download) return downloadSerializer.use(order, client);
		if (operation === constants.orderOperations.upload) return uploadSerializer.use(order, client);

		throw Error('Error from orders/orders.js: Wrong order version/type.');
	},
};
