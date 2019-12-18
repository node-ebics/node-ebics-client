#! /usr/bin/env node

'use strict';

const ebics = require('../index');
const configjs = require('./config.js');

const client = gClient;

// Client keys must be already generated and send by letter.
// The bank should have enabled the user
client.send(ebics.Orders.HPB)
	.then((resp) => {
		console.log('Response for HPB order %j', resp);
		if (resp.technicalCode !== '000000')
			throw new Error('Something went wrong');

		console.log('Received bank keys: %j', resp.bankKeys);
		return client.setBankKeys(resp.bankKeys);
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
