'use strict';

/* eslint-disable no-loop-func */

const { assert } = require('chai');

const path = require('path');
const fs = require('fs');

const ebics = require('../../');

const libxml = require('libxmljs');

const schemaPath = path.resolve(__dirname, '../xsd/ebics_H004.xsd');
const schemaDoc = libxml.parseXml(fs.readFileSync(schemaPath, { encoding: 'utf8' }));

const schemaDir = path.dirname(schemaPath);
const cwd = process.cwd();

const validateXML = (str) => {
	try {
		process.chdir(schemaDir);
		const isValid = libxml.parseXmlString(str).validate(schemaDoc);
		process.chdir(cwd);
		return isValid;
	} catch (e) {
		process.chdir(cwd);
		return false;
	}
};

const client = new ebics.Client({
	url: 'https://iso20022test.credit-suisse.com/ebicsweb/ebicsweb',
	partnerId: 'CRS04381',
	userId: 'CRS04381',
	hostId: 'CRSISOTB',
	passphrase: 'test',
	keyStorage: ebics.fsKeysStorage(path.resolve(__dirname, './TEST_KEYS.key')),
});

const { Orders } = ebics;

describe('H004 order generation', () => {
	// eslint-disable-next-line no-restricted-syntax
	for (const order of Object.values(Orders)) {
		if (typeof order === 'function')
			continue;

		const type = order.orderDetails.OrderType;
		const { operation } = order;

		it(`[${operation}] ${type} order generation`, async () => {
			const signedOrder = await client.signOrder(order);
			assert.isTrue(validateXML(signedOrder));
		});
	}
});
