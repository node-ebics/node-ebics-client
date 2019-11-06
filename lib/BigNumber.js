'use strict';

const { jsbn: { BigInteger } } = require('node-forge');

class BigNumber {
	constructor(value = '') {
		this._n = new BigInteger(null);
		this._n.fromInt(value);
	}

	toBEBuffer(length = undefined) {
		const arr = this._n.toByteArray();
		if (length && arr.length > length)
			throw new Error('Number out of range.');
		while (arr.length < length)
			arr.unshift(0);
		return Buffer.from(arr);
	}
}

module.exports = BigNumber;
