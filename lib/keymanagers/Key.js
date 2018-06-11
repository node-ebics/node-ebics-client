'use strict';

const BN = require('bn.js');
const NodeRSA = require('node-rsa');

module.exports = class Key {
	constructor(encodedKey/* , passphrase = null */) {
		this._key = (encodedKey instanceof NodeRSA) ? encodedKey : new NodeRSA(encodedKey);
	}

	static generate(keysize = 2048) {
		return new NodeRSA({ b: keysize });
	}

	static importKey({ mod, exp }) {
		const key = new NodeRSA();

		key.importKey({ n: mod, e: exp }, 'components-public');

		return new Key(key);
	}

	get key() {
		return this._key;
	}

	n(to = 'buff') {
		const keyN = Buffer.from(this.key.exportKey('components-public').n);

		return to === 'hex'
			? keyN.toString('hex', 1)
			: keyN;
	}

	e(to = 'buff') {
		const eKey = new BN(this.key.exportKey('components-public').e).toBuffer();

		return to === 'hex'
			? eKey.toString('hex')
			: eKey;
	}

	d() {
		return this.key.keyPair.d.toBuffer();
	}

	toPem() {
		return this.key.isPrivate() ? this.key.exportKey('pkcs1-private-pem') : this.key.exportKey('pkcs8-public-pem');
	}
};
