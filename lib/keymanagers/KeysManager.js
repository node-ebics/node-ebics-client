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

module.exports = class KeysManager {
	constructor(keysStorage, passphrase, algorithm = 'aes-256-cbc', createIfNone = true) {
		this._storage = keysStorage;
		this._passphrase = passphrase;
		this._algorithm = algorithm;

		if (createIfNone && !this._storage.hasData())
			this.generate();
	}

	/**
	 * Generates the keys to work with. Then either
	 * saves them to the storage or returnes the keys generated
	 *
	 * @param {Boolean} save
	 * @default true
	 *
	 * @returns void | Keys object
	 */
	generate(save = true) {
		const keys = Keys.generate();

		if (save) this.write(keys);

		return keys;
	}

	/**
	 * Writes the keys to the storage
	 *
	 * @param {Keys} keysObject
	 *
	 * @returns void
	 */
	write(keysObject) {
		keysObject = keysObject.keys;

		Object.keys(keysObject).map((key) => {
			keysObject[key] = keysObject[key] === null ? null : keysObject[key].toPem();

			return key;
		});

		this._storage.save(encrypt(JSON.stringify(keysObject), this._algorithm, this._passphrase));
	}

	setBankKeys(bankKeys) {
		const keys = this.keys();

		keys.setBankKeys(bankKeys);
		this.write(keys);
	}

	/**
	 * Gets the keys
	 *
	 * @returns Keys object
	 */
	keys() {
		return this._read();
	}

	/**
	 * Reads the keys from the storage
	 *
	 * @returns Keys object
	 */
	_read() {
		const keysString = this._storage.read();

		return new Keys(JSON.parse(decrypt(keysString, this._algorithm, this._passphrase)));
	}
};
