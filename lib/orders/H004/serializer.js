'use strict';

const orders = require('../orders');

const iniSerializer = require('./serializers/ini');
const downloadSerializer = require('./serializers/download');
const uploadSerializer = require('./serializers/upload');

module.exports = {
	use(order) {
		const { version, orderType } = order;

		if (orders.version(version).isIni(orderType)) return iniSerializer.use(order);
		if (orders.version(version).isDownload(orderType)) return downloadSerializer.use(order);
		if (orders.version(version).isUpload(orderType)) return uploadSerializer.use(order);

		throw Error('Error from orders/orders.js: Wrong order version/type.');
	},
};
