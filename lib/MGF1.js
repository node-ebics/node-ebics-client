'use strict'

const crypto = require("crypto");
const BN     = require('bn.js');

module.exports = class MGF1 {

	constructor() {
		this._len = 32;
	}

	/**
	 *
	 * @param {Buffer} seed
	 * @param {Number} masklen
	 *
	 * @returns Buffer
	 */
	static generate(seed, masklen) {
		const mgf1 = new MGF1();

		if ( masklen > 4294967296 * this._len) {
			throw new Error('Mask too long');
		}

		const b = [];

		for (let i = 0; i < mgf1._divceil(masklen, mgf1._len); i++) {
			b[i] = crypto.createHash('sha256').update(Buffer.concat([seed, mgf1._i2osp(i, 4)])).digest();
		}

		return (Buffer.concat(b)).slice(0, masklen);
	}

	static xor(a, b) {
		if ( a.length != b.length ) {
			throw new Error('Different length for a and b');
		}

		for ( let i = 0; i < a.length; i++ ) {
			a[i] ^= b[i];
		}

		return a;
	}

	_divceil(a, b) {
		return ~~((a + b - 1) / b);
	}

	_i2osp(x, len) {
		if ( x >= 256 ** len ) {
			throw new Error('Integer too large');
		}

		return Buffer.from(this._rjust( (Buffer.from((new BN(x)).toArray('be', 4)).toString()).replace(/\x00/gi, ''), len, "\x00" ));
	}

	_rjust( string, width, padding ) {
		padding = padding || " ";
		padding = padding.substr( 0, 1 );
		if ( string.length < width )
			return padding.repeat( width - string.length ) + string;
		else
			return string;
	}
}
