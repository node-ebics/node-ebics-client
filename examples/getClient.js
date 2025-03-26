'use strict';

const { Client, fsKeysStorage } = require('../index');

const loadConfig = require('./loadConfig');

module.exports = ({
	url,
	partnerId,
	userId,
	hostId,
	passphrase,
	iv,
	keyStoragePath,
} = loadConfig()) => new Client({
	url,
	partnerId,
	userId,
	hostId,
	passphrase,
	iv,
	keyStorage: fsKeysStorage(keyStoragePath),
});
