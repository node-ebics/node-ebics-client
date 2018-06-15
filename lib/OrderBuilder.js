'use strict';

const crypto = require('crypto');

const constants = require('./consts');

module.exports = class OrderBuilder {
	constructor() {
		this._productString = constants.productString;
		this._transactionKey = crypto.randomBytes(16);
	}

	details(data) {
		this._data = data;
		this._data.transactionId = null;

		return this;
	}

	static h004() {
		const builder = new OrderBuilder();

		builder._version = 'H004';

		return builder;
	}

	/**
	 * Getters
	 */
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
	get version() { return this._version; }
	get productString() { return this._productString; }
	get orderType() { return this.orderDetails.OrderType; }

	set transactionId(tid) {
		this._data.transactionId = tid === '' ? null : tid;
	}

	hasTransactionId() {
		return this.transactionId !== null;
	}
};
