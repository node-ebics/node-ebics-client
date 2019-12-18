#! /usr/bin/env node

'use strict';

const client = require('./getClient')();

// The bank keys must have been already saved
client.send(ebics.Orders.HTD)
	.then((resp) => {
		console.log('Response for HTD order %j', resp);
		if (resp.technicalCode !== '000000')
			throw new Error('Something went wrong');

		const data = Buffer.from(resp.orderData);
		console.log(data.toString('utf8'));
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
