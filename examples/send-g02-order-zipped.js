#! /usr/bin/env node

'use strict';

const fs = require('fs');

const client = require('./getClient')();
const { Orders } = require('../index');

// The bank keys must have been already saved
client.send(Orders.G02(null, null)) // startDate 'YYYY-MM-DD', endDate 'YYYY-MM-DD'
	.then((resp) => {
		console.log('Response for G02 order %j', resp);
		if (resp.technicalCode !== '000000')
			throw new Error('Something went wrong');

		// Parsing and processing the G02 Pain.002.001.06 file should happen somewhere here, ideally after saving it to disk
		const data = Buffer.from(resp.orderData); 
		let distPath = "G02.zip"; 
		const dstZip = fs.createWriteStream(distPath); 
		dstZip.write(data); 
		dstZip.end();
	})

	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
