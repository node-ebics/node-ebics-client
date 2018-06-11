'use strict';

const crypto = require('crypto');

// const orderTypes = ['ini', 'download', 'upload', 'zip'];

module.exports = class OrderBuilder {
	constructor() {
		this._transactionKey = crypto.randomBytes(16);
		this._root = {
			nodeName: 'ebicsRequest',
			nodeAttributes: {
				'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#',
				xmlns: 'urn:org:ebics:H004',
				Version: 'H004',
				Revision: '1',
			},
		};
		this._body = {};
	}

	details(data) {
		this._data = data;
		this._data.transactionId = null;

		return this;
	}

	static payment() {
		const builder = new OrderBuilder();

		builder._type = 'payment';

		return builder;
	}

	static status() {
		const builder = new OrderBuilder();

		builder._type = 'status';

		return builder;
	}

	static ini() {
		const builder = new OrderBuilder();

		builder._type = 'ini';
		builder._root.nodeName = 'ebicsUnsecuredRequest';

		return builder;
	}

	/**
	 * Getters
	 */
	get type() { return this._type; }
	get root() { return this._root; }
	get body() { return this._body; }
	get data() { return this._data; }
	get orderDetails() { return this._data.orderDetails; }
	get transactionId() { return this._data.transactionId; }
	get document() { return this._data.document; }
	get transactionKey() { return this._transactionKey; }
	get ebicsData() { return this._data.ebicsData; }
	get hostId() { return this._data.ebicsData.hostId; }
	get partnerId() { return this._data.ebicsData.partnerId; }
	get userId() { return this._data.ebicsData.userId; }
	get keys() { return this._data.ebicsData.keysManager.keys(); }

	set transactionId(tid) {
		this._data.transactionId = tid === '' ? null : tid;
	}

	hasTransactionId() {
		return this.transactionId !== null;
	}
};
