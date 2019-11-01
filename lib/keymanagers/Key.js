'use strict';

const {
	pki: {
		rsa,
		publicKeyToPem,
		privateKeyToPem,
		publicKeyFromPem,
		privateKeyFromPem,
	},
	jsbn: {
		BigInteger,
	},
} = require('node-forge');

const getKeyType = (str) => {
	const matches = str.match(/(PRIVATE|PUBLIC) KEY/);
	if (!matches)
		return null;
	return matches[1].toLowerCase();
};

const keyFromPem = (pem) => {
	const type = getKeyType(pem);
	const isPublic = type === 'public';
	const key = isPublic ? publicKeyFromPem(pem) : privateKeyFromPem(pem);

	return {
		isPublic,
		key,
	};
};

/**
 * Creates a public key from modulus and exponent
 * @param {Buffer} mod - the modulus
 * @param {Buffer} exp - the exponent
 */
const keyFromModAndExp = (mod, exp) => {
	const bnMod = new BigInteger(mod.toString('hex'), 16);
	const bnExp = new BigInteger(exp.toString('hex'), 16);

	return {
		key: rsa.setPublicKey(bnMod, bnExp),
		isPublic: true,
	};
};

module.exports = class Key {
	constructor({
		pem = null, mod = null, exp = null, size = 2048,
	} = {}) {
		// generate new private key
		if (!pem && !mod && !exp) {
			const keyPair = rsa.generateKeyPair(size);

			this.keyIsPublic = false;
			this.privateKey = keyPair.privateKey;
			this.publicKey = keyPair.publicKey;

			return;
		}

		// new key from pem string
		if (pem) {
			const { key, isPublic } = keyFromPem(pem);

			this.keyIsPublic = isPublic;
			this.privateKey = isPublic ? null : key;
			this.publicKey = isPublic ? key : null;

			return;
		}

		// new key from mod and exp
		if (mod && exp) {
			const { key, isPublic } = keyFromModAndExp(mod, exp);

			this.keyIsPublic = isPublic;
			this.privateKey = isPublic ? null : key;
			this.publicKey = isPublic ? key : null;

			return;
		}

		// not good
		throw new Error(`Can not create key without ${!mod ? 'modulus' : 'exponent'}.`);
	}

	static generate(size = 2048) {
		return new Key({ size });
	}

	static importKey({ mod, exp }) {
		return new Key({ mod, exp });
	}

	n(to = 'buff') {
		const key = this.keyIsPublic ? this.publicKey : this.privateKey;
		const keyN = Buffer.from(key.n.toByteArray());

		return to === 'hex' ? keyN.toString('hex', 1) : keyN;
	}

	e(to = 'buff') {
		const key = this.keyIsPublic ? this.publicKey : this.privateKey;
		const eKey = Buffer.from(key.e.toByteArray());

		return to === 'hex' ? eKey.toString('hex') : eKey;
	}

	d() {
		if (this.keyIsPublic)
			throw new Error('Can not get d component out of public key.');

		return Buffer.from(this.privateKey.d.toByteArray());
	}

	isPrivate() {
		return !this.keyIsPublic;
	}

	isPublic() {
		return this.keyIsPublic;
	}

	// eslint-disable-next-line class-methods-use-this
	size() {
		const keyN = this.n('hex');
		const bn = new BigInteger(keyN, 16);

		return bn.bitLength();
	}

	toPem() {
		return this.keyIsPublic ? publicKeyToPem(this.publicKey) : privateKeyToPem(this.privateKey);
	}
}
