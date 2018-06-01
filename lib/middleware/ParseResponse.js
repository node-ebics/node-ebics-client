'use strict';

const Response = require('../Response');

module.exports = class ParseResponse {
	constructor(client, data) {
		this.client = client;
		this.data = data;
	}

	static go(client, data) {
		// const parseRensponse = new ParseResponse(client, data);
		const response = new Response(client, data);

		// TODO:
		// raise error if any

		this.data = response.doc;

		return response;
	}
};
