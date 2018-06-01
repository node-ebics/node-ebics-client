'use strict';

const Signer = require('../Signer');

module.exports = class XMLSign {
	constructor(client, data) {
		this.client = client;
		this.data = data;
	}

	static go(client, data) {
		// const xmlSigner = new XMLSign(client, data);
		const signer = new Signer(client, data);

		signer.digest();
		signer.sign();

		this.data = signer.toXML();

		return this.data;
	}
};
