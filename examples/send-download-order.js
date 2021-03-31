#! /usr/bin/env node

'use strict';

const fs = require('fs');

const client = require('./getClient')();
const { Orders } = require('../index');

var supportedOrderTypes = [
	{ orderType: 'C52', filePrefix: 'CAMT052', needsDates: true, fileExtension: '.xml' },
	{ orderType: 'C53', filePrefix: 'CAMT053', needsDates: true, fileExtension: '.xml' },
	{ orderType: 'DKI', filePrefix: 'DKI', needsDates: true, fileExtension: '.txt' },
	{ orderType: 'STA', filePrefix: 'MT940', needsDates: true, fileExtension: '.txt' },
	{ orderType: 'VMK', filePrefix: 'MT942', needsDates: true, fileExtension: '.txt' },
	{ orderType: 'HAA', filePrefix: 'HAA', needsDates: false, fileExtension: '.xml' },
	{ orderType: 'HAC', filePrefix: 'HAC', needsDates: true, fileExtension: '.xml' },
	{ orderType: 'HKD', filePrefix: 'HKD', needsDates: false, fileExtension: '.xml' },
	{ orderType: 'HPB', filePrefix: 'HPB', needsDates: false, fileExtension: '.xml' },
	{ orderType: 'HPD', filePrefix: 'HPD', needsDates: false, fileExtension: '.xml' },
	{ orderType: 'HTD', filePrefix: 'HTD', needsDates: false, fileExtension: '.xml' },
	{ orderType: 'PTK', filePrefix: 'PTK', needsDates: true, fileExtension: '.txt' }
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
	//This orderType exists, but we want to check if this orderType can be used for plain text/xml
	if (filteredOrderType[0])
	{
		const startDate=global.startdate;
		const endDate=global.enddate;
		const currentDate = new Date().toISOString();
		var splitDate = currentDate.split("T");

		// The bank keys must have been already saved
		if(filteredOrderType[0].needsDates)
		{
		client.send(orderType(startDate, endDate))
			.then((resp) => {
				console.log('Response for '+global.ordertype+' order %j', resp);
				if (resp.technicalCode !== '000000')
					throw new Error('Something went wrong');

				// Parsing and processing the file should happen somewhere here, ideally after saving it to disk
				const data = Buffer.from(resp.orderData);
				let distPath = global.entity ? client.storageLocation+filteredOrderType[0].filePrefix+"_"+client.hostId+"_EBICS_"+global.entity+"_"+splitDate[0].replace("-","").replace("-","")+filteredOrderType[0].fileExtension : client.storageLocation+filteredOrderType[0].filePrefix+"_"+client.hostId+"_EBICS_"+splitDate[0].replace("-","").replace("-","")+filteredOrderType[0].fileExtension;
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
		}
		else
		{
			client.send(orderType)
			.then((resp) => {
				console.log('Response for '+global.ordertype+' order %j', resp);
				if (resp.technicalCode !== '000000')
					throw new Error('Something went wrong');

				// Parsing and processing the file should happen somewhere here, ideally after saving it to disk
				const data = Buffer.from(resp.orderData);
				let distPath = global.entity ? client.storageLocation+filteredOrderType[0].filePrefix+"_"+client.hostId+"_EBICS_"+global.entity+"_"+splitDate[0].replace("-","").replace("-","")+filteredOrderType[0].fileExtension : client.storageLocation+filteredOrderType[0].filePrefix+"_"+client.hostId+"_EBICS_"+splitDate[0].replace("-","").replace("-","")+filteredOrderType[0].fileExtension;
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
		}
	}
	else
	{
		console.log(global.ordertype+" order type is supported, but not for plain text/xml file type");
	}
}
