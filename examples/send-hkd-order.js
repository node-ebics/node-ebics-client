#! /usr/bin/env node

'use strict';

const ebics = require('../index');

const client = new ebics.Client({
	url: 'https://ebics.server',
	partnerId: '',
	userId: '',
	hostId: '',
	passphrase: 'test', // keys-test will be decrypted with this passphrase
	keyStorage: ebics.fsKeysStorage('./keys-test'),
});

// The bank keys must have been already saved
client.send(ebics.Orders.HKD)
	.then((resp) => {
		console.log('Response for HKD order %j', resp);
		if (resp.technicalCode !== '000000')
			throw new Error('Something went wrong');

		const data = Buffer.from(resp.orderData);
		console.log(data.toString('utf8'));
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
