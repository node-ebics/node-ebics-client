'use strict';

const { jsbn: { BigInteger } } = require('node-forge');

class BigNumber {
	constructor(value, radix = 10) {
		if (value === null || value === undefined)
			throw new Error('value is missing.');

		this._n = new BigInteger(null);

		if (value instanceof BigNumber)
			this._n = value._n;
		else if (value instanceof BigInteger)
			this._n = value;
		else if (typeof value === 'number')
			this._n.fromInt(value);
		else if (typeof value === 'string')
			this._n.fromString(value, radix);
		else if (Buffer.isBuffer(value))
			this._n.fromString(value.toString('hex'), 16);
		else if (Array.isArray(value))
			this._n.fromString(Buffer.from(value).toString('hex'), 16);
		else
			throw new TypeError('Unsupported value type.');
	}

	toBEBuffer(length = undefined) {
		const arr = this._n.toByteArray();
		if (length && arr.length > length)
			throw new Error('Number out of range.');
		while (length && arr.length < length)
			arr.unshift(0);
		return Buffer.from(arr);
	}

	toBuffer() {
		return Buffer.from(this._n.toByteArray());
	}

	toString(radix = 10) {
		const result = this._n.toString(radix);
		if (radix === 16)
			return result.padStart(2, '0');
		return result;
	}

	and(num) {
		return new BigNumber(this._n.and(new BigNumber(num)._n));
	}

	mul(num) {
		return new BigNumber(this._n.multiply(new BigNumber(num)._n));
	}

	mod(num) {
		return new BigNumber(this._n.mod(new BigNumber(num)._n));
	}

	shrn(num) {
		return new BigNumber(this._n.shiftRight(new BigNumber(num)._n));
	}
}

module.exports = BigNumber;
