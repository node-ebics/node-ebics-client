#! /usr/bin/env node

'use strict';

const fs = require('fs');

const client = require('./getClient')();
const { Orders } = require('../index');

// The bank keys must have been already saved
const paymentFile = fs.readFileSync('FCY_PAYMENT.xml').toString();

client.send(Orders.G1V(paymentFile))
	.then((resp) => {
		console.log('Response for G1V order %j', resp);
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
