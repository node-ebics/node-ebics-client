#! /usr/bin/env node

'use strict';

const fs = require('fs');

const client = require('./getClient')();
const { Orders } = require('../index');

var supportedOrderTypes = [
	{ orderType: 'AZV' },
	{ orderType: 'CCS' },
	{ orderType: 'CCT' },
	{ orderType: 'CD1' },
	{ orderType: 'CDB' },
	{ orderType: 'CDD' },
	{ orderType: 'CDS' },
	{ orderType: 'G1R' },
	{ orderType: 'G1V' },
	{ orderType: 'XCT' },
	{ orderType: 'XE3' },
	{ orderType: 'XG1' }
];

var filteredOrderType = supportedOrderTypes.filter(function(el) {
	return (el.orderType === global.ordertype);
});

const paymentFile = fs.readFileSync(global.filename).toString();

//Nasty eval to see if Order Type exists but it works
const orderType=eval('Orders.'+global.ordertype);

//If orderType is not defined it doesn't exists in supported orders.
if(orderType === undefined)
{
	console.log("Unsupported order type: "+global.ordertype);
}
else
{
	//This orderType exists, but we want to check if this orderType is allowed for upload
	if (filteredOrderType)
	{
		client.send(orderType(paymentFile))
			.then((resp) => {
				console.log('Response for '+global.ordertype+' order %j', resp);
				if (resp.technicalCode !== '000000')
					throw new Error('Something went wrong');
				})
				.catch((err) => {
					console.error(err);
					process.exit(1);
				});
	}
}
