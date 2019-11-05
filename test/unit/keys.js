'use strict';

/* eslint-env node, mocha */

const { assert } = require('chai');
const fixtures = require('../fixtures/keys');
// const Key = require('../lib/keymanagers/keyRSA');
const Key = require('../../lib/keymanagers/Key');

const stripWhitespace = str => str.replace(/\s+/g, '');

describe('Keys management', () => {
	describe('generates brand new', () => {
		const keySize = 2048;
		// const newKey = Key().generate(keySize);
		const newKey = Key.generate();

		it('private key', () => {
			assert.isTrue(newKey.isPrivate());
		});

		it('that has the right key size', () => {
			// const newKeySize = newKey.size(); // console.log(newKey.size());
			assert(newKey.size(), keySize);
		});
	});

	describe('creates public key from mod and exp', () => {
		const { pem, mod, exp } = fixtures.pblc.big;

		describe('that are strings', () => {
			const m = Buffer.from(mod.string, 'base64');
			const e = Buffer.from(exp.string, 'base64');
			/* const newKey = Key().importKey({
				mod: m, exp: e, modulus: mod.string, exponent: exp.string,
			}); */
			const newKey = new Key({ mod: m, exp: e });

			it('and is really public', () => {
				assert.isTrue(newKey.isPublic());
			});


			it('and has a propper mod in bytes', () => {
				assert.deepEqual([...newKey.n()], mod.bytes);
			});

			it('and has a propper pem string', () => {
				assert.equal(stripWhitespace(newKey.toPem()), stripWhitespace(pem));
			});
		});

		describe('that are bytes', () => {
			const m = Buffer.from(mod.bytes);
			const e = Buffer.from(exp.bytes);
			/* const newKey = Key().importKey({
				mod: m, exp: e, modulus: mod.string, exponent: exp.string,
			}); */
			const newKey = new Key({ mod: m, exp: e });

			it('and is really public', () => {
				assert.isTrue(newKey.isPublic());
			});

			it('and has a propper mod as a string', () => {
				assert.equal(newKey.n().toString('base64'), mod.string);
			});

			it('and has a propper pem string', () => {
				assert.equal(stripWhitespace(newKey.toPem()), stripWhitespace(pem));
			});
		});
	});

	describe('creates public key from pem string', () => {
		const { pem } = fixtures.pblc.big;
		// const newKey = Key(pem);
		const newKey = new Key({ pem });

		it('and is really public', () => {
			assert.isTrue(newKey.isPublic());
		});

		it('and has a propper(the same) pem string', () => {
			/* newKey.pempem = {
				modulus: mod.string,
				exponent: exp.string,
			}; */
			assert.equal(stripWhitespace(newKey.toPem()), stripWhitespace(pem));
		});
	});
});
