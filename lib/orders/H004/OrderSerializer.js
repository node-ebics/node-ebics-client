'use strict';

const InitializationSerializer = require('./InitializationSerializer');
const StatusSerializer = require('./StatusSerializer');
const PaymentSerializer = require('./PaymentSerializer');

module.exports = class OrderSerializer {
	static serialize(order) {
		if (order.type === 'ini') return new InitializationSerializer(order);
		if (order.type === 'payment') return new PaymentSerializer(order);
		if (order.type === 'status') return new StatusSerializer(order);

		throw Error('Incorect order type. Available types: ini, status, payment, statement');
	}
};
