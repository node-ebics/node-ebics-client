#! /usr/bin/env node

'use strict';

const ebics = require('../index');

const client = new ebics.Client({
	url: 'https://ebics.server',
	partnerId: 'PARTNER',
	userId: 'USER',
	hostId: 'HOST',
	passphrase: 'test', // keys-test will be encrypted with this keys
	keyStorage: ebics.fsKeysStorage('./keys-test'),
});

// New keys will be generated and saved in ./keys-test
client.send(ebics.Orders.INI)
	.then((resp) => {
		console.log('Respose for INI order %j', resp);
		return client.send(ebics.Orders.HIA);
	})
	.then((resp) => {
		console.log('Reponse for HIA order %j', resp);
		if (resp.technicalCode !== '000000')
			throw new Error('Something might went wrong');

		console.log('Public keys should be sent to bank now. See examples/bankLetter.js');
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
