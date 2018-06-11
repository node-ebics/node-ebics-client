'use strict';

const Response = require('../Response');

module.exports = class ParseResponse {
	static go(keys, data) {
		const response = new Response(keys, data);

		// TODO:
		// raise error if any

		this.data = response.doc;

		return response;
	}
};
