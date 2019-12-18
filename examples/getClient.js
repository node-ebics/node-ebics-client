'use strict';

const { Client, fsKeysStorage } = require('../index');

const loadConfig = require('./loadConfig');

module.exports = ({
	serverAddress,
	partnerId,
	userId,
	hostId,
	passphrase,
	keyStoragePath,
} = loadConfig()) => new Client({
	serverAddress,
	partnerId,
	userId,
	hostId,
	passphrase,
	keyStorage: fsKeysStorage(keyStoragePath),
});
