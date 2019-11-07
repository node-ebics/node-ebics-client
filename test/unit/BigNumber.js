'use strict';

/* eslint-env node, mocha */

const { assert } = require('chai');
const { jsbn: { BigInteger } } = require('node-forge');

const BigNumber = require('../../lib/crypto/BigNumber');

const types = [
	{ name: 'BigNumber', value: new BigNumber(11) },
	{ name: 'BigInteger', value: new BigInteger('11') },
	{ name: 'string with default radix', value: '11' },
	{ name: 'string with radix 16', value: '0b', radix: 16 },
	{ name: 'Buffer', value: Buffer.from('0b', 'hex') },
	{ name: 'Array', value: [11] },
];

describe('BigNumber', () => {
	describe('creating an instance', () => {
		it('should throw with no value given', () => assert.throws(() => new BigNumber()));
		it('should throw wrong value type', () => assert.throws(() => new BigNumber({})));

		for (const { name, value, radix } of types) {
			let instance;
			describe(`out of ${name}`, () => {
				it('create instance', () => assert.doesNotThrow(() => {
					instance = new BigNumber(value, radix);
				}));
				it('toString with radix 10', () => assert.equal(instance.toString(), '11'));
				it('toString with radix 16', () => assert.equal(instance.toString(16), '0b'));
				it('toBEBuffer without length', () => assert.equal(instance.toBEBuffer().toString('hex'), '0b'));
				it('toBEBuffer with length', () => assert.equal(instance.toBEBuffer(4).toString('hex'), '0000000b'));
			});
		}
	});
	describe('exports', () => {
		it('toBEBuffer with too short length should throw', () => assert.throw(() => new BigNumber(837462187362).toBEBuffer(1)));
	});
	describe('operators', () => {
		const num = new BigNumber(1);
		it('and', () => assert.equal(num.and(1), 1));
		it('mul', () => assert.equal(num.mul(2), 2));
		it('mod', () => assert.equal(num.mod(1), 0));
		it('shrn', () => assert.equal(num.shrn(1), 0));
	});
});
