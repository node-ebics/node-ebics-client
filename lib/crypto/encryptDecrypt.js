'use strict';

const crypto = require('crypto');

const createKeyAndIv = (passphrase) => {
	// this generates a 256-bit key and a 128-bit iv for aes-256-cbc
	// just like nodejs's deprecated/removed crypto.createCipher would
	const a = crypto.createHash('md5').update(passphrase).digest();
	const b = crypto
		.createHash('md5')
		.update(Buffer.concat([a, Buffer.from(passphrase)]))
		.digest();
	const c = crypto
		.createHash('md5')
		.update(Buffer.concat([b, Buffer.from(passphrase)]))
		.digest();
	const bytes = Buffer.concat([a, b, c]);
	const key = bytes.subarray(0, 32);
	const iv = bytes.subarray(32, 48);
	return { key, iv };
};

const encrypt = (data, algorithm, passphrase, iv) => {
	let cipher;
	if (iv) {
		cipher = crypto.createCipheriv(algorithm, passphrase, iv);
	} else {
		console.warn(
			'[Deprecation notice] No IV provided, falling back to legacy key derivation.\n'
            + 'This will be removed in a future major release. You should encrypt your keys with a proper key and IV.',
		);
		if (crypto.createCipher) {
			// nodejs < 22
			cipher = crypto.createCipher(algorithm, passphrase);
		} else {
			const { key, iv: generatedIv } = createKeyAndIv(passphrase);
			cipher = crypto.createCipheriv(algorithm, key, generatedIv);
		}
	}
	const encrypted = cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
	return Buffer.from(encrypted).toString('base64');
};

const decrypt = (data, algorithm, passphrase, iv) => {
	data = Buffer.from(data, 'base64').toString();
	let decipher;
	if (iv) {
		decipher = crypto.createDecipheriv(algorithm, passphrase, iv);
	} else {
		console.warn(
			'[Deprecation notice] No IV provided, falling back to legacy key derivation.\n'
			+ 'This will be removed in a future major release. You should re-encrypt your keys with a proper key and IV.',
		);
		if (crypto.createDecipher) {
			// nodejs < 22
			decipher = crypto.createDecipher(algorithm, passphrase);
		} else {
			const { key, iv: generatedIv } = createKeyAndIv(passphrase);
			decipher = crypto.createDecipheriv(algorithm, key, generatedIv);
		}
	}
	const decrypted = decipher.update(data, 'hex', 'utf8') + decipher.final('utf8');
	return decrypted;
};

module.exports = { encrypt, decrypt };
