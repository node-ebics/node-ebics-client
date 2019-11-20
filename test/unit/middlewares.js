'use strict';

/* eslint-env node, mocha */

const { assert } = require('chai');

const response = require('../../lib/middleware/response');
const serializer = require('../../lib/middleware/serializer');
const signer = require('../../lib/middleware/signer');

describe('Middlewares', () => {
	describe('Response Middleware', () => {
		it('should throw with no unspported protocol version', () => assert.throws(() => response('H003')));
	});
	describe('Signer Middleware', () => {
		it('should throw with no unspported protocol version', () => assert.throws(() => signer('H003')));
	});
	describe('Signer Middleware', () => {
		it('should throw with no unspported protocol version', () => assert.throws(() => serializer('H003')));
	});
});
