'use strict';

const BN = require('bn.js');
const NodeRSA = require('node-rsa');

const keyOrNull = (encodedKey) => {
	if (encodedKey === null) return new NodeRSA();

	return (encodedKey instanceof NodeRSA) ? encodedKey : new NodeRSA(encodedKey);
};

module.exports = encodedKey => ({
	key: keyOrNull(encodedKey),

	generate(keySize = 2048) {
		return new NodeRSA({ b: keySize });
	},

	importKey({ mod, exp }) {
		this.key.importKey({ n: mod, e: exp }, 'components-public');
	},

	n(to = 'buff') {
		const keyN = Buffer.from(this.key.exportKey('components-public').n);

		return to === 'hex'
			? keyN.toString('hex', 1)
			: keyN;
	},

	e(to = 'buff') {
		const eKey = new BN(this.key.exportKey('components-public').e).toBuffer();

		return to === 'hex'
			? eKey.toString('hex')
			: eKey;
	},

	d() {
		return this.key.keyPair.d.toBuffer();
	},

	toPem() {
		return this.key.isPrivate() ? this.key.exportKey('pkcs1-private-pem') : this.key.exportKey('pkcs8-public-pem');
	},
});
