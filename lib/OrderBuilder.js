'use strict';

const crypto = require('crypto');

// const orderTypes = ['ini', 'download', 'upload', 'zip'];

module.exports = class OrderBuilder {
	constructor() {
		this._transactionKey = crypto.randomBytes(16);
	}

	details(data) {
		this._data = data;
		this._data.transactionId = null;

		return this;
	}

	payment() {
		this._type = 'payment';

		return this;
	}

	status() {
		this._type = 'status';

		return this;
	}

	ini() {
		this._type = 'ini';

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
	get type() { return this._type; }
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

	set transactionId(tid) {
		this._data.transactionId = tid === '' ? null : tid;
	}

	hasTransactionId() {
		return this.transactionId !== null;
	}
};
