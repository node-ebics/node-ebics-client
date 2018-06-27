'use strict';

const $request = require('request');

const constants = require('./consts');
const Keys = require('./keymanagers/Keys');
const defaultKeyEncryptor = require('./keymanagers/defaultKeyEncryptor');

const signer = require('./middleware/signer');
const serializer = require('./middleware/serializer');
const response = require('./middleware/response');

const stringifyKeys = (keys) => {
	Object.keys(keys).map((key) => {
		keys[key] = keys[key] === null ? null : keys[key].toPem();

		return key;
	});

	return JSON.stringify(keys);
};

module.exports = class Client {
	constructor({
		url,
		partnerId,
		userId,
		hostId,
		passphrase,
		keyStorage,
	}) {
		if (!url)
			throw new Error('EBICS URL is requierd');
		if (!partnerId)
			throw new Error('partnerId is requierd');
		if (!userId)
			throw new Error('userId is requierd');
		if (!hostId)
			throw new Error('hostId is requierd');
		if (!passphrase)
			throw new Error('passphrase is requierd');

		if (!keyStorage || typeof keyStorage.read !== 'function' || typeof keyStorage.write !== 'function')
			throw new Error('keyStorage implemntation missing or wrong');

		this.url = url;
		this.partnerId = partnerId;
		this.userId = userId;
		this.hostId = hostId;
		this.keyStorage = keyStorage;
		this.keyEncryptor = defaultKeyEncryptor({ passphrase });
	}

	async send(order) {
		const isInObject = ('operation' in order);

		if (!isInObject) throw new Error('Operation for the order needed');

		if (order.operation.toUpperCase() === constants.orderOperations.ini) return this.initialization(order);

		const keys = await this.keys();
		if (keys === null) throw new Error('No keys provided. Can not send the order or any other order for that matter.');

		if (order.operation.toUpperCase() === constants.orderOperations.upload) return this.upload(order);
		if (order.operation.toUpperCase() === constants.orderOperations.download) return this.download(order);

		throw new Error('Wrong order operation provided');
	}

	async initialization(order) {
		const keys = await this.keys();
		if (keys === null) this._generateKeys();

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
		return new Promise(async (resolve, reject) => {
			const { version } = order;
			const keys = await this.keys();

			$request.post({
				url: this.url,
				body: signer.version(version).sign((await serializer.use(order, this)).toXML(), keys.x()),
				headers: { 'content-type': 'text/xml;charset=UTF-8' },
			}, (err, res, data) => (err ? reject(err) : resolve(response.version(version)(data, keys))));
		});
	}

	async keys() {
		const keysString = await this._readKeys();

		return keysString ? new Keys(JSON.parse(this.keyEncryptor.decrypt(keysString))) : null;
	}

	_generateKeys() {
		const keysObject = Keys.generate();

		this._writeKeys(keysObject);
	}

	async setBankKeys(bankKeys) {
		const keysObject = await this.keys();

		keysObject.setBankKeys(bankKeys);
		await this._writeKeys(keysObject);
	}

	async _readKeys() {
		try {
			const keys = await this.keyStorage.read();

			return keys;
		} catch (err) {
			return null;
		}
	}

	async _writeKeys(keysObject) {
		try {
			await this.keyStorage.write(this.keyEncryptor.encrypt(stringifyKeys(keysObject.keys)));
		} catch (err) {
			throw err;
		}
	}
};
