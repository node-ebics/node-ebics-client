'use strict';

/* eslint-disable camelcase */

function rsaPublicKeyPem(modulus_b64, exponent_b64) {
	function prepadSigned(hexStr) {
		const msb = hexStr[0];
		if (
			(msb >= '8' && msb <= '9') ||
            (msb >= 'a' && msb <= 'f') ||
            (msb >= 'A' && msb <= 'F'))
			return `00${hexStr}`;

		return hexStr;
	}

	function toHex(number) {
		const nstr = number.toString(16);
		if (nstr.length % 2 === 0) return nstr;
		return `0${nstr}`;
	}

	// encode ASN.1 DER length field
	// if <=127, short from
	// if >=128, long from
	function encodeLengthHex(n) {
		if (n <= 127) return toHex(n);

		const n_hex = toHex(n);
		const length_of_length_byte = 128 + (n_hex.length / 2); // 0x80+numbytes
		return toHex(length_of_length_byte) + n_hex;
	}

	const modulus = Buffer.from(modulus_b64, 'base64');
	const exponent = Buffer.from(exponent_b64, 'base64');

	let modulus_hex = modulus.toString('hex');
	let exponent_hex = exponent.toString('hex');

	modulus_hex = prepadSigned(modulus_hex);
	exponent_hex = prepadSigned(exponent_hex);

	const modlen = modulus_hex.length / 2;
	const explen = exponent_hex.length / 2;

	const encoded_modlen = encodeLengthHex(modlen);
	const encoded_explen = encodeLengthHex(explen);
	const encoded_pubkey = `30${
		encodeLengthHex(modlen + explen + (encoded_modlen.length / 2) + (encoded_explen.length / 2) + 2)
	}02${encoded_modlen}${modulus_hex
	}02${encoded_explen}${exponent_hex}`;

	let seq2 =
        `${'30 0d ' +
          '06 09 2a 86 48 86 f7 0d 01 01 01' +
          '05 00 ' +
        '03'}${encodeLengthHex((encoded_pubkey.length / 2) + 1)
        }00${encoded_pubkey}`;

	seq2 = seq2.replace(/ /g, '');

	let der_hex = `30${encodeLengthHex(seq2.length / 2)}${seq2}`;

	der_hex = der_hex.replace(/ /g, '');

	const der = Buffer.from(der_hex, 'hex');
	const der_b64 = der.toString('base64');

	const pem = `-----BEGIN PUBLIC KEY-----\n${
		der_b64.match(/.{1,64}/g).join('\n')
	}\n-----END PUBLIC KEY-----\n`;

	return pem.trim();
}

const BN = require('bn.js');
const NodeRSA = require('node-rsa');

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

const isKeyInstance = (obj) => {
	if (typeof obj !== 'object')
		return false;
	return ('publicKey' in obj && 'privateKey' in obj);
};

const getKeyType = (str) => {
	const matches = str.match(/(PRIVATE|PUBLIC) KEY/);
	if (!matches)
		return null;
	return matches[1].toLowerCase();
};

/*
class RsaKeyPair {
	constructor() {
		this._isPublic = null;
		this._publicKey = null;
		this._privateKey = null;
	}
	fromString(str) {

	}
}
*/

const keyOrNull = (encodedKey) => {
	if (encodedKey === null) return {};
	if (typeof encodedKey === 'string') {
		const type = getKeyType(encodedKey);
		const isPublic = type === 'public';
		const key = isPublic ? publicKeyFromPem(encodedKey) : privateKeyFromPem(encodedKey);
		key.isPublic = isPublic;
		return key;
	}

	return encodedKey;
	// return (isKeyInstance(encodedKey)) ? encodedKey;

	/* const k = (encodedKey instanceof NodeRSA) ? encodedKey : new NodeRSA(encodedKey);
	if (k.keyPair.e === 16777216)
		k.keyPair.e = 4294967311;
	return k; */
};

module.exports = (encodedKey) => {
	if (encodedKey && encodedKey.__RsaKey)
		return encodedKey;
	return {
		__RsaKey: true,
		key: keyOrNull(encodedKey),

		generate(keySize = 2048) {
			const keyPair = rsa.generateKeyPair(keySize);
			this.key = keyPair.privateKey;
			this.key.isPublic = false;
			this.publicKey = keyPair.publicKey;
			return this;
		// return rsa.generateKeyPair(keySize);
		// return new NodeRSA({ b: keySize });
		},

		importKey({
			mod,
			exp,
			modulus,
			exponent,
		}) {
			this.key = rsa.setPublicKey(new BigInteger(mod.toString('hex'), 16), new BigInteger(exp.toString('hex'), 16));
			this.key.isPublic = true;
			// const k = rsa.generateKeyPair();
			// k.publicKey = rsa.setPublicKey(mod, exp);
			// this.key = k;
			// this.key.publicKey.

			// .this.key.importKey({ n: mod, e: exp }, 'components-public');
			/*
		this.pempem = modulus && exponent ? {
			modulus,
			exponent,
		} : null;
		*/

			return this;
		},

		n(to = 'buff') {
			const key = this.publicKey || this.key;
			const keyN = Buffer.from(key.n.toByteArray());

			return to === 'hex'
				? keyN.toString('hex', 1)
				: keyN;
		},

		e(to = 'buff') {
			const key = this.publicKey || this.key;
			const eKey = Buffer.from(key.e.toByteArray()); // new BN(this.key.exportKey('components-public').e).toBuffer();

			return to === 'hex'
				? eKey.toString('hex')
				: eKey;
		},

		d() {
			return Buffer.from(this.key.d.toByteArray());
		// return this.key.keyPair.d.toBuffer();
		},

		isPrivate() {
			return !this.key.isPublic;
		},

		isPublic() {
			return this.key.isPublic;
		// return this.key.isPublic();
		},

		size() {
			return 2048;
		// return this.key.getKeySize();
		},

		toPem() {
			if (this.isPublic())
				return publicKeyToPem(this.key);
			return privateKeyToPem(this.key);
		/*
		if (this.pempem)
			return rsaPublicKeyPem(this.pempem.modulus, this.pempem.exponent);
		const isPrivate = this.key.isPrivate();
		const pem = isPrivate ? this.key.exportKey('pkcs1-private-pem') : this.key.exportKey('pkcs8-public-pem');
		return pem;
		*/
		},
	};
};
