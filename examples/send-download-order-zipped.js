#! /usr/bin/env node

'use strict';

const fs = require('fs');

const client = require('./getClient')();
const { Orders } = require('../index');

var supportedOrderTypes = [
	{ orderType: 'C52', filePrefix: 'CAMT052' },
	{ orderType: 'C53', filePrefix: 'CAMT053' },
	{ orderType: 'C54', filePrefix: 'CAMT054' },
	{ orderType: 'G02', filePrefix: 'G02' },
	{ orderType: 'G52', filePrefix: 'CAMT052-G52' },
	{ orderType: 'G53', filePrefix: 'CAMT053-G53' },
	{ orderType: 'Z52', filePrefix: 'CAMT052-Z52' },
	{ orderType: 'Z53', filePrefix: 'CAMT053-Z53' },
	{ orderType: 'Z54', filePrefix: 'CAMT054-Z54' }
];

var filteredOrderType = supportedOrderTypes.filter(function(el) {
	return (el.orderType === global.ordertype);
});

//Nasty eval to see if Order Type exists but it works
const orderType=eval('Orders.'+global.ordertype);

//If orderType is not defined it doesn't exists in supported orders.
if(orderType === undefined)
{
	console.log("Unsupported order type: "+global.ordertype);
}
else
{
	//This orderType exists, but we want to check if this orderType is using ZIP
	if (filteredOrderType[0])
	{
		const startDate=global.startdate;
		const endDate=global.enddate;
		const currentDate = new Date().toISOString();
		var splitDate = currentDate.split("T");

		// The bank keys must have been already saved

		client.send(orderType(startDate, endDate)) // startDate 'YYYY-MM-DD', endDate 'YYYY-MM-DD'
		.then((resp) => {
			console.log('Response for '+orderType+' order %j', resp);
			if (resp.technicalCode !== '000000')
				throw new Error('Something went wrong');

			// Parsing and processing of the zipped file should happen somewhere here, ideally after saving it to disk
			const data = Buffer.from(resp.orderData);
			let distPath = global.entity ? client.storageLocation+filteredOrderType[0].filePrefix+"_"+client.hostId+"_EBICS_"+global.entity+"_"+splitDate[0].replace("-","").replace("-","")+".zip" : client.storageLocation+filteredOrderType[0].filePrefix+"_"+client.hostId+"_EBICS_"+splitDate[0].replace("-","").replace("-","")+".zip"; 
			const dstZip = fs.createWriteStream(distPath)
			dstZip.write(data); 
			dstZip.end();
			dstZip.on('finish', (err) => {
				console.log("Successfully wrote zipped "+ filteredOrderType[0].orderType +" file: " + distPath);
			});
			dstZip.on('error', (err) => {
			console.log("Error writing zip file: "+err);
			});
		});
	}
	else
	{
		console.log(global.ordertype+" order type is supported, but not for ZIP type");
	}
}
