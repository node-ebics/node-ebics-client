'use strict';

const InitializationSerializer = require('./serializers/InitializationSerializer');
const StatusSerializer = require('./serializers/StatusSerializer');
const PaymentSerializer = require('./serializers/PaymentSerializer');

module.exports = class OrderSerializer {
	static serialize(order) {
		if (order.type === 'ini') return new InitializationSerializer(order);
		if (order.type === 'payment') return new PaymentSerializer(order);
		if (order.type === 'status') return new StatusSerializer(order);

		throw Error('Incorect order type. Available types: ini, status, payment, statement');
	}
};
