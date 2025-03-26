'use strict';

const { encrypt, decrypt } = require('../crypto/encryptDecrypt');


module.exports = ({ passphrase, iv, algorithm = 'aes-256-cbc' }) => ({
	encrypt: data => encrypt(data, algorithm, passphrase, iv),
	decrypt: data => decrypt(data, algorithm, passphrase),
});
