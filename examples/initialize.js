#! /usr/bin/env node

'use strict';

const ebics = require('../index');
const configjs = require('./config.js');

const client = gClient;
const { Orders } = require('../index');


// New keys will be generated and saved in ./keys-test
client.send(Orders.INI)
	.then((resp) => {
		console.log('Response for INI order %j', resp);
		return client.send(ebics.Orders.HIA);
	})
	.then((resp) => {
		console.log('Response for HIA order %j', resp);
		if (resp.technicalCode !== '000000')
			throw new Error('Something might went wrong');

		console.log('Public keys should be sent to bank now. See examples/bankLetter.js');
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
