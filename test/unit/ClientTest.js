'use strict';

/* eslint-env node, mocha */

const { assert } = require('chai');

const { Client, fsKeysStorage, tracesStorage } = require('../../index.js');

describe('Client', () => {
	describe('instantiating', () => {
		it('should throw with no options provided', () => assert.throws(() => new Client()));
		it('should throw with no url provided', () => assert.throws(() => new Client({})));
		it('should throw with no partnerId provided', () => assert.throws(() => new Client({ url: 'https://myebics.com' })));
		it('should throw with no userId provided', () => assert.throws(() => new Client({ url: 'https://myebics.com', partnerId: 'partnerId' })));
		it('should throw with no hostId provided', () => assert.throws(() => new Client({ url: 'https://myebics.com', partnerId: 'partnerId', userId: 'userId' })));
		it('should throw with no passphrase provided', () => assert.throws(() => new Client({
			url: 'https://myebics.com', partnerId: 'partnerId', userId: 'userId', hostId: 'hostId',
		})));
		it('should throw with no keyStorage provided', () => assert.throws(() => new Client({
			url: 'https://myebics.com', partnerId: 'partnerId', userId: 'userId', hostId: 'hostId', passphrase: 'test',
		})));
		it('should create an isntance without tracesStorage', () => assert.doesNotThrow(() => new Client({
			url: 'https://myebics.com', partnerId: 'partnerId', userId: 'userId', hostId: 'hostId', passphrase: 'test', keyStorage: fsKeysStorage('./test.key'),
		})));
		it('should create an isntance with tracesStorage', () => assert.doesNotThrow(() => new Client({
			url: 'https://myebics.com', partnerId: 'partnerId', userId: 'userId', hostId: 'hostId', passphrase: 'test', keyStorage: fsKeysStorage('./test.key'), tracesStorage: tracesStorage('./'),
		})));
	});
});
