#! /usr/bin/env node

'use strict';

const fs = require('fs');

const client = require('./getClient')();
const { Orders } = require('../index');

const currentDate = new Date().toISOString();
var splitDate = currentDate.split("T");

// The bank keys must have been already saved
client.send(Orders.HPD)
	.then((resp) => {
		console.log('Response for HPD order %j', resp);
		if (resp.technicalCode !== '000000')
			throw new Error('Something went wrong');

		// Parsing and processing the HKD file should happen somewhere here, ideally after saving it to disk
		const data = Buffer.from(resp.orderData);
		let distPath = global.entity ? client.storageLocation+"HPD_"+client.bankShortName+"_EBICS_"+global.entity+"_"+splitDate[0].replace("-","").replace("-","")+".xml" : client.storageLocation+"HPD_"+client.bankShortName+"_EBICS_"+splitDate[0].replace("-","").replace("-","")+".xml";
		fs.writeFile(distPath, data.toString('utf8'), function (err)
		{
			if(err) {
				return console.log("Error writing file: ",err);
			}
			else
			{
				console.log("File " + distPath + " was written successfully!");
			}
		})
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
