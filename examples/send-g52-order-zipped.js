#! /usr/bin/env node

'use strict';

const fs = require('fs');

const client = require('./getClient')();
const { Orders } = require('../index');

const currentDate = new Date().toISOString();
var splitDate = currentDate.split("T");

// The bank keys must have been already saved
client.send(Orders.G52(null, null)) // startDate 'YYYY-MM-DD', endDate 'YYYY-MM-DD'
	.then((resp) => {
		console.log('Response for G52 order %j', resp);
		if (resp.technicalCode !== '000000')
			throw new Error('Something went wrong');

		// Parsing and processing of the zipped CAMT052-G52 file should happen somewhere here, ideally after saving it to disk
		const data = Buffer.from(resp.orderData);
		let distPath = global.entity ? client.storageLocation+"CAMT052-G52_"+client.bankShortName+"_EBICS_"+global.entity+"_"+splitDate[0].replace("-","").replace("-","")+".zip" : client.storageLocation+"CAMT052-G52_"+client.bankShortName+"_EBICS_"+splitDate[0].replace("-","").replace("-","")+".zip"; 
		const dstZip = fs.createWriteStream(distPath)
		dstZip.write(data); 
		dstZip.end();
		dstZip.on('finish', (err) => {
			console.log("Successfully wrote zipped CAMT052 file: " + distPath);
		});
		dstZip.on('error', (err) => {
			console.log("Error writing zip file: "+err);
		});
	});
