'use strict';

const H004Signer = require('../versions/H004/Signer');

const H004Serializer = require('../versions/H004/OrderSerializer');

module.exports = class XMLSign {
	static sign(order) {
		const { keys } = order;

		if (order.version.toUpperCase() === 'H004') return new H004Signer(H004Serializer.serialize(order).toXML(), keys).digest().sign().toXML();

		throw Error('Error from XMLSign class: Invalid version number');
	}
};
