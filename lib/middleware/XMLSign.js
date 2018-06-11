'use strict';

const Signer = require('../Signer');

module.exports = class XMLSign {
	static go(keys, xml) {
		const signer = new Signer(keys, xml);

		signer.digest();
		signer.sign();

		this.data = signer.toXML();

		return this.data;
	}
};
