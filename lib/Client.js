'use strict';

// const fs = require('fs');
// const path = require('path');

const $request = require('request');

const XMLSign = require('./middleware/XMLSign');
const ParseResponse = require('./middleware/ParseResponse');
// const BankLetter = require('./BankLetter');

const OrderSerializer = require('./orders/H004/OrderSerializer');


/* const defaultIniTemplatePath = path.join(__dirname, '../templates/ini.hbs');

const utils = {
	mapObject: (o = {}, predicate = v => v) => Object.entries(o).reduce((r, [key, value]) => { r[key] = value; return r; }, o),
	exponent: {
		// str = 65537 => AQAB
		toBase64(str) {
			return new BN(str).toBuffer().toString('base64');
		},
		// str = AQAB => 65537
		fromBase64(str) {
			return new BN(Buffer.from(str, 'base64'), 2).toNumber();
		},
	},
}; */

module.exports = class Client {
	/* constructor({
		url,
		 hostId,
		userId,
		partnerId,
		keyManager = new FsKeyManager({ path: './keys.ebics', passphrase: 'node-ebics' }),
	}) {
		this.url = url;
		this.hostId = hostId;
		this.userId = userId;
		this.partnerId = partnerId;
		this.keyManager = keyManager;
	} */

	constructor({ url }) {
		this.url = url;
	}

	/*

	saveIniLetter(bankName, target, template) {
		const letter = new BankLetter({
			client: this,
			bankName,
			template: template || fs.readFileSync(defaultIniTemplatePath, { encoding: 'utf8' }),
		});

		try {
			fs.writeFileSync(target, letter.generate());
		} catch (error) {
			throw error;
		}
	}
 	*/


	async initialization(order) {
		const res = await this.ebicsRequest(OrderSerializer.serialize(order));
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
		const res = await this.ebicsRequest(OrderSerializer.serialize(order));

		order.transactionId = res.transactionId();

		if (res.isSegmented() && res.isLastSegment())
			await this.ebicsRequest(OrderSerializer.serialize(order));

		// return res.orderData();
		return {
			orderData: res.orderData(),
			orderId: res.orderId(),
			returnCode: res.returnCode(),
			reportText: res.reportText(),
		};
	}

	async upload(order) {
		let res = await this.ebicsRequest(OrderSerializer.serialize(order));
		const transactionId = res.transactionId();
		const orderId = res.orderId();

		order.transactionId = transactionId;

		res = await this.ebicsRequest(OrderSerializer.serialize(order));

		return [transactionId, orderId];
	}

	async downloadAndUnzip(order) { // eslint-disable-line

	}

	ebicsRequest(serializedOrder) {
		const { keys } = serializedOrder;

		return new Promise((resolve, reject) => {
			const s = XMLSign.go(keys, serializedOrder.toXML());
			$request.post({
				url: this.url,
				body: s, // XMLSign.go(this, serializedOrder),
				headers: { 'content-type': 'text/xml;charset=UTF-8' },
			}, (err, res, data) => (err ? reject(err) : resolve(ParseResponse.go(keys, data))));
		});
	}

	request(order) {
		if (order.type.toLowerCase() === 'ini') return this.initialization(order);
		if (order.type.toLowerCase() === 'payment') return this.upload(order);
		if (order.type.toLowerCase() === 'status') return this.download(order);

		throw Error('Invalid order type');
	}
};
