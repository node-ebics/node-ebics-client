'use strict';

const crypto = require('crypto');

const Keys = require('./Keys');

const encrypt = (data, algorithm, passphrase) => {
	const cipher = crypto.createCipher(algorithm, passphrase);
	const encrypted = cipher.update(data, 'utf8', 'hex') + cipher.final('hex');

	return Buffer.from(encrypted).toString('base64');
};
const decrypt = (data, algorithm, passphrase) => {
	data = (Buffer.from(data, 'base64')).toString();

	const decipher = crypto.createDecipher(algorithm, passphrase);
	const decrypted = decipher.update(data, 'hex', 'utf8') + decipher.final('utf8');

	return decrypted;
};

module.exports = (keysStorage, passphrase, algorithm = 'aes-256-cbc') => {
	const storage = keysStorage;
	const pass = passphrase;
	const algo = algorithm;
	// const createIfNone = createIfNone;

	return {
		generate(save = true) {
			const keys = Keys.generate();

			if (save) {
				this.write(keys);

				return this;
			}

			return keys;
		},

		write(keysObject) {
			keysObject = keysObject.keys;

			Object.keys(keysObject).map((key) => {
				keysObject[key] = keysObject[key] === null ? null : keysObject[key].toPem();

				return key;
			});

			storage.write(encrypt(JSON.stringify(keysObject), algo, pass));

			return this;
		},

		setBankKeys(bankKeys) {
			const keys = this.keys();

			keys.setBankKeys(bankKeys);
			this.write(keys);
		},

		keys() {
			const keysString = storage.read();

			return new Keys(JSON.parse(decrypt(keysString, algo, pass)));
		},
	};
};
