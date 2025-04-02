'use strict';

const { encrypt, decrypt } = require('../crypto/encryptDecrypt');
const Keys = require('./Keys');

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
