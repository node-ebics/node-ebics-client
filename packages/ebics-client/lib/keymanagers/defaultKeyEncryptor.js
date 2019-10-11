'use strict';

const crypto = require('crypto');

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

module.exports = ({
	passphrase,
	algorithm = 'aes-256-cbc',
}) => ({
	encrypt: data => encrypt(data, algorithm, passphrase),
	decrypt: data => decrypt(data, algorithm, passphrase),
});
