'use strict';

const crypto = require('crypto');
const BN = require('bn.js');

const MFG_LEN = 32;

const divceil = (a, b) => ~~(((a + b) - 1) / b); // eslint-disable-line no-bitwise
const rjust = (string, width, padding) => {
	padding = padding || ' ';
	padding = padding.substr(0, 1);
	if (string.length < width)
		return padding.repeat(width - string.length) + string;
	return string;
};
const xor = (a, b) => {
	if (a.length !== b.length)
		throw new Error('Different length for a and b');

	for (let i = 0; i < a.length; i++)
		a[i] ^= b[i]; // eslint-disable-line no-bitwise

	return a;
};
const i2osp = (x, len) => {
	if (x >= 256 ** len)
		throw new Error('Integer too large');

	return Buffer.from(rjust((Buffer.from((new BN(x)).toArray('be', 4)).toString()).replace(/\x00/gi, ''), len, '\x00')); // eslint-disable-line no-control-regex
};

module.exports = {
	generate(seed, masklen) {
		if (masklen > 4294967296 * MFG_LEN)
			throw new Error('Mask too long');


		const b = [];

		for (let i = 0; i < divceil(masklen, MFG_LEN); i++)
			b[i] = crypto.createHash('sha256').update(Buffer.concat([seed, i2osp(i, 4)])).digest();


		return (Buffer.concat(b)).slice(0, masklen);
	},
	xor,
	rjust,
};
