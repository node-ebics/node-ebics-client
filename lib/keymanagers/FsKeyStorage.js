'use strict';

const fs = require('fs');
/* const extractKeys = (keysObject, encryptAlgorithm, passphrase) => Object.entries(keysObject).reduce((keys, [key, data]) => {
	keys[key] = decrypt(data, encryptAlgorithm, passphrase);
	return keys;
}, {}); */

module.exports = class FsKeyStorage {
	/**
	 * @param {String} path - destingiton file to save the keys
	 */
	constructor({ path }) {
		if (!path)
			throw new Error('Invalid path provided');

		this._path = path;
	}

	get path() {
		return this._path;
	}

	read() {
		return fs.readFileSync(this._path, { encoding: 'utf8' });
		// return extractKeys(JSON.parse(fs.readFileSync(this._path, { encoding: 'utf8' })), this.algorithm, this.passphrase);
	}

	save(data) {
		fs.writeFileSync(this._path, data, { encoding: 'utf8' });
		// fs.writeFileSync(this._path, encrypt(JSON.stringify(data), this.algorithm, this.passphrase), { encoding: 'utf8' });
	}

	hasData() {
		if (fs.existsSync(this._path))
			return this.read() !== '';

		return false;
	}
};
