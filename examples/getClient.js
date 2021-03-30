'use strict';

const { Client, fsKeysStorage } = require('../index');

const loadConfig = require('./loadConfig');

module.exports = ({
	url,
	partnerId,
	userId,
	hostId,
	passphrase,
	keyStoragePath,
	bankName,
	bankShortName,
	languageCode,
	storageLocation,
} = loadConfig()) => new Client({
	url,
	partnerId,
	userId,
	hostId,
	passphrase,
	keyStorage: fsKeysStorage(keyStoragePath),
	bankName,
	bankShortName,
	languageCode,
	storageLocation,
});
