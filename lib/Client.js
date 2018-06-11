'use strict';

const $request = require('request');

const XMLSign = require('./middleware/XMLSign');
const ParseResponse = require('./middleware/ParseResponse');

module.exports = class Client {
	constructor({ url }) {
		this.url = url;
	}

	async initialization(order) {
		const res = await this.ebicsRequest(order);
		const xml = res.orderData();

		return {
			orderData: xml,
			orderId: res.orderId(),
			returnCode: res.returnCode(),
			reportText: res.reportText(),
			bankKeys: res.bankKeys(),
		};
	}

	async download(order) {
		const res = await this.ebicsRequest(order);

		order.transactionId = res.transactionId();

		if (res.isSegmented() && res.isLastSegment())
			await this.ebicsRequest(order);

		// return res.orderData();
		return {
			orderData: res.orderData(),
			orderId: res.orderId(),
			returnCode: res.returnCode(),
			reportText: res.reportText(),
		};
	}

	async upload(order) {
		let res = await this.ebicsRequest(order);
		const transactionId = res.transactionId();
		const orderId = res.orderId();

		order.transactionId = transactionId;

		res = await this.ebicsRequest(order);

		return [transactionId, orderId];
	}

	async downloadAndUnzip(order) { // eslint-disable-line

	}

	ebicsRequest(order) {
		return new Promise((resolve, reject) => {
			$request.post({
				url: this.url,
				body: XMLSign.sign(order),
				headers: { 'content-type': 'text/xml;charset=UTF-8' },
			}, (err, res, data) => (err ? reject(err) : resolve(ParseResponse.parse(data, order.keys, order.version))));
		});
	}

	request(order) {
		if (order.type.toLowerCase() === 'ini') return this.initialization(order);
		if (order.type.toLowerCase() === 'payment') return this.upload(order);
		if (order.type.toLowerCase() === 'status') return this.download(order);

		throw Error('Invalid order type');
	}
};
