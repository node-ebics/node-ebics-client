'use strict';

const $request = require('request');

const signer = require('./middleware/signer');
const serializer = require('./middleware/serializer');
const response = require('./middleware/response');

module.exports = class Client {
	constructor(url) {
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

	ebicsRequest(order) {
		return new Promise((resolve, reject) => {
			const { version, keys } = order;
			// const s = signer.version(version).use(serializer.use(order).toXML(), keys).digest().sign().toXML(); // new (signer.version(version))(serializer.use(order).toXML(), keys).digest().sign().toXML();
			$request.post({
				url: this.url,
				body: signer.version(version).sign(serializer.use(order).toXML(), keys), // s, // new (signer.version(version))(serializer.use(order).toXML(), keys).digest().sign().toXML(),
				headers: { 'content-type': 'text/xml;charset=UTF-8' },
			}, (err, res, data) => (err ? reject(err) : resolve(response.version(version)(data, keys))));
		});
	}

	ini(order) {
		return this.initialization(order);
	}

	payment(order) {
		return this.upload(order);
	}

	statement(order) {
		return this.download(order);
	}

	status(order) {
		return this.download(order);
	}
};
