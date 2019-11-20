'use strict';

/* eslint-env node, mocha */

const { readFileSync } = require('fs');
const { join, resolve } = require('path');

const { assert } = require('chai');

const H004Response = require('../../lib/orders/H004/response');
const ebics = require('../../');


const client = new ebics.Client({
	url: 'https://iso20022test.credit-suisse.com/ebicsweb/ebicsweb',
	partnerId: 'CRS04381',
	userId: 'CRS04381',
	hostId: 'CRSISOTB',
	passphrase: 'test',
	keyStorage: ebics.fsKeysStorage(resolve(__dirname, '../support/TEST_KEYS.key')),
});

const buildResponse = (xmlPath) => {
	const response = H004Response('<xml/>', {});
	const xml = readFileSync(xmlPath, { encoding: 'utf8' });
	response.orderData = () => xml;
	return response;
};

const fixtures = {
	HPB: async () => H004Response(readFileSync(join(__dirname, '../fixtures/HPB_response.xml'), { encoding: 'utf8' }), await client.keys()),
	HPB_DATA: () => buildResponse(join(__dirname, '../fixtures/HPB_response_data.xml')),
	INI: () => H004Response(readFileSync(join(__dirname, '../fixtures/INI_reposne.xml'), { encoding: 'utf8' }), client.keys()),
	STA_1: () => H004Response(readFileSync(join(__dirname, '../fixtures/STA_response_part1.xml'), { encoding: 'utf8' }), client.keys()),
	STA_2: () => H004Response(readFileSync(join(__dirname, '../fixtures/STA_response_part2.xml'), { encoding: 'utf8' }), client.keys()),
	x002mod: 'AJWVHQIfP0H1fr5Y7IjSlDmFksqQ+0E+CjzbEeE6r444LCuSXwbGKF6DJqguyX1qGYxjHRvVtdkNa+GNAtlZnmuPeLHPBUOs5Zx9J5JP4JZOcKd/wnRDIasTkg3NrtZ22tjOrWx26VuR6h7dUH2oJRnFDHmbXoCDMxkqJUNr/TM89p5slJ9Oj5+NAaOzm+7AlwbJ95EI/xc2jEfhp+GdF9CYdS/m2AZaAt79y6QDtBSDdAs0OHTgsOIjbjZkptBF/Gkip2sOordjsChRNLHLDcAOWbsg1NVMuhXs1b6+bCVLXQcGhFydYhqvrXB7pFS0++hlyzqGhbZK5cwEe/v8EJk=',
	e002mod: 'AJWVHQIfP0H1fr5Y7IjSlDmFksqQ+0E+CjzbEeE6r444LCuSXwbGKF6DJqguyX1qGYxjHRvVtdkNa+GNAtlZnmuPeLHPBUOs5Zx9J5JP4JZOcKd/wnRDIasTkg3NrtZ22tjOrWx26VuR6h7dUH2oJRnFDHmbXoCDMxkqJUNr/TM89p5slJ9Oj5+NAaOzm+7AlwbJ95EI/xc2jEfhp+GdF9CYdS/m2AZaAt79y6QDtBSDdAs0OHTgsOIjbjZkptBF/Gkip2sOordjsChRNLHLDcAOWbsg1NVMuhXs1b6+bCVLXQcGhFydYhqvrXB7pFS0++hlyzqGhbZK5cwEe/v8EJk=',
};


describe('H004 response parsing', () => {
	it('parses bank keys', () => {
		const response = fixtures.HPB_DATA();
		const bankKeys = response.bankKeys();

		assert.equal(bankKeys.bankX002.mod.toString('base64'), fixtures.x002mod);
		assert.equal(bankKeys.bankE002.mod.toString('base64'), fixtures.e002mod);
	});

	it('detects unsegmented response', () => {
		const response = fixtures.HPB_DATA();
		assert.equal(response.isSegmented(), false);
		assert.equal(response.isLastSegment(), false);
	});

	it('detects segmented response', () => {
		const responsePart1 = fixtures.STA_1();
		const responsePart2 = fixtures.STA_2();
		assert.equal(responsePart1.isSegmented(), true);
		assert.equal(responsePart1.isLastSegment(), false);
		assert.equal(responsePart2.isSegmented(), true);
		assert.equal(responsePart2.isLastSegment(), true);
	});

	it('parses OrderID', () => {
		const response = fixtures.INI();
		assert.equal(response.orderId(), 'B004');
	});

	it('parses BuissnessCode', () => {
		const response = fixtures.INI();
		const code = response.businessCode();
		assert.equal(code, '000000');
		assert.equal(response.businessSymbol(code), 'EBICS_OK');
		assert.equal(response.businessMeaning(code), 'No technical errors occurred during processing of the EBICS request');
		assert.equal(response.businessShortText(code), 'OK');
	});

	it('parses TechnicalCode', () => {
		const response = fixtures.INI();
		const code = response.technicalCode();
		assert.equal(code, '000000');
		assert.equal(response.technicalSymbol(code), '[EBICS_OK] OK');
		assert.equal(response.technicalMeaning(code), 'No technical errors occurred during processing of the EBICS request');
		assert.equal(response.technicalShortText(code), 'OK');
	});

	it('parses TransactionID', () => {
		const response = fixtures.STA_1();
		const code = response.transactionId();
		assert.equal(code, 'ECD6F062AAEDFA77250526A68CBEC549');
	});

	it('parses TransactionKey', async () => {
		const response = await fixtures.HPB();
		const code = response.transactionKey().toString('base64');
		assert.equal(code, '2OTepxiy49uayuzZlYFf8Q==');
	});

	it('parses OrderData', async () => {
		const response = await fixtures.HPB();
		const orderBuffer = response.orderData();
		assert.deepEqual(orderBuffer, readFileSync(join(__dirname, '../fixtures/HPB_response_data.xml')));
	});

	it('generates XML', async () => {
		const response = await fixtures.HPB();
		const xmlString = response.toXML().replace('\\n', '\n');
		assert.deepEqual(xmlString, readFileSync(join(__dirname, '../fixtures/HPB_response.xml'), { encoding: 'utf8' }));
	});
});
