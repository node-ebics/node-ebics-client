'use strict';

/* eslint-env node, mocha */

const { assert } = require('chai');

const path = require('path');
const fs = require('fs');

const ebics = require('../../');

const xmlLintWasm = require('xmllint-wasm');

const validateXML = (() => {
	const xsdDir = path.resolve(__dirname, '../xsd');
	const schemaPath = path.resolve(xsdDir, 'ebics_H004.xsd');
	const schemaDoc = fs.readFileSync(schemaPath, { encoding: 'utf8' });
	const preload = fs
		.readdirSync(xsdDir)
		.filter(file => file.endsWith('.xsd') && file !== 'ebics_H004.xsd')
		.map(file => ({
			fileName: file,
			contents: fs.readFileSync(path.join(xsdDir, file), {
				encoding: 'utf8',
			}),
		}));

	return async (str) => {
		const results = await xmlLintWasm.validateXML({
			xml: { fileName: 'ebics.xml', contents: str },
			schema: [
				{
					fileName: 'ebics_H004.xsd',
					contents: schemaDoc,
				},
			],
			preload,
		});
		return results.valid;
	};
})();

const client = new ebics.Client({
	url: 'https://iso20022test.credit-suisse.com/ebicsweb/ebicsweb',
	partnerId: 'CRS04381',
	userId: 'CRS04381',
	hostId: 'CRSISOTB',
	passphrase: 'test',
	keyStorage: ebics.fsKeysStorage(
		path.resolve(__dirname, '../support/TEST_KEYS.key'),
	),
});

const { Orders } = ebics;

/*
upload :
const AZV = require('./AZV');
const CD1 = require('./CD1');
const CDB = require('./CDB');
const CDD = require('./CDD');
const CDS = require('./CDS');
const CCT = require('./CCT');
const CCS = require('./CCS');
const XE3 = require('./XE3');
const XCT = require('./XCT');
*/
const uploadBuilder = fn => fn('');
const dateBuilder = fn => fn('2018-01-01', '2019-01-01');

const fnOrders = {
	// upload | document
	AZV: uploadBuilder,
	CD1: uploadBuilder,
	CDB: uploadBuilder,
	CDD: uploadBuilder,
	CDS: uploadBuilder,
	CCT: uploadBuilder,
	CCS: uploadBuilder,
	XE3: uploadBuilder,
	XCT: uploadBuilder,

	// download
	STA: dateBuilder,
	VMK: dateBuilder,
	HAA: dateBuilder,
	HTD: dateBuilder,
	HPD: dateBuilder,
	HKD: dateBuilder,
	PTK: dateBuilder,
	HAC: dateBuilder,
	Z53: dateBuilder,
	DKI: dateBuilder,
	C53: dateBuilder,
	C52: dateBuilder,
};

const getOrderObject = (name, order) => {
	if (typeof order === 'object') return order;
	if (fnOrders[name]) return fnOrders[name](order);
	return null;
};

describe('H004 order generation', () => {
	// eslint-disable-next-line no-restricted-syntax
	for (const [name, orderDefinition] of Object.entries(Orders)) {
		const order = getOrderObject(name, orderDefinition);
		if (!order) continue;

		const type = order.orderDetails.OrderType;
		const { operation } = order;

		it(`[${operation}] ${type} order generation`, async () => {
			const signedOrder = await client.signOrder(order);
			assert.isTrue(await validateXML(signedOrder));
		});
	}
});
