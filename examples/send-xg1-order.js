#! /usr/bin/env node

'use strict';

const ebics = require('../index');
const fs = require('fs');

const client = require('./getClient')();

// The bank keys must have been already saved
const paymentFile = fs.readFileSync('mytestfile.xml').toString();

client.send(ebics.Orders.XG1(paymentFile))
	.then((resp) => {
		console.log('Response for XG1 order %j', resp);
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
