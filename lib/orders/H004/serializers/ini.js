'use strict';

const zlib = require('zlib');

const js2xmlparser = require('js2xmlparser');

const Crypto = require('../../../crypto/Crypto');

const genericSerializer = require('./generic');

const keySignature = (ebicsAccount, key, xmlOptions) => {
	const xmlOrderData = {
		'@': {
			'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#',
			xmlns: 'http://www.ebics.org/S001',
		},
		SignaturePubKeyInfo: {
			PubKeyValue: {
				'ds:RSAKeyValue': {
					'ds:Modulus': key.n().toString('base64'),
					'ds:Exponent': key.e().toString('base64'),
				},
				TimeStamp: Crypto.timestamp(),
			},
			SignatureVersion: 'A006',
		},
		PartnerID: ebicsAccount.partnerId,
		UserID: ebicsAccount.userId,
	};

	return js2xmlparser.parse('SignaturePubKeyOrderData', xmlOrderData, xmlOptions);
};
const orderData = (ebicsAccount, keys, xmlOptions) => {
	const xmlOrderData = {
		'@': {
			'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#',
			xmlns: 'urn:org:ebics:H004',
		},
		AuthenticationPubKeyInfo: {
			PubKeyValue: {
				'ds:RSAKeyValue': {
					'ds:Modulus': keys.x().n().toString('base64'),
					'ds:Exponent': keys.x().e().toString('base64'),
				},
			},
			AuthenticationVersion: 'X002',
		},
		EncryptionPubKeyInfo: {
			PubKeyValue: {
				'ds:RSAKeyValue': {
					'ds:Modulus': keys.e().n().toString('base64'),
					'ds:Exponent': keys.e().e().toString('base64'),
				},
			},
			EncryptionVersion: 'E002',
		},
		PartnerID: ebicsAccount.partnerId,
		UserID: ebicsAccount.userId,
	};

	return js2xmlparser.parse('HIARequestOrderData', xmlOrderData, xmlOptions);
};
const commonHeader = (ebicsAccount, orderDetails, productString) => ({
	'@': { authenticate: true },
	static: {
		HostID: ebicsAccount.hostId,
		Nonce: Crypto.nonce(),
		Timestamp: Crypto.timestamp(),
		PartnerID: ebicsAccount.partnerId,
		UserID: ebicsAccount.userId,
		Product: {
			'@': { Language: 'en' },
			'#': productString,
		},
		OrderDetails: orderDetails,
		SecurityMedium: '0000',
	},
	mutable: {},
});
const process = {
	INI: {
		rootName: 'ebicsUnsecuredRequest',
		header: (ebicsAccount, orderDetails, productString) => {
			const ch = commonHeader(ebicsAccount, orderDetails, productString);

			delete ch.static.Nonce;
			delete ch.static.Timestamp;

			return ch;
		},
		body: (ebicsAccount, keys, xmlOptions) => ({
			DataTransfer: {
				OrderData: Buffer.from(zlib.deflateSync(keySignature(ebicsAccount, keys.a(), xmlOptions))).toString('base64'),
			},
		}),
	},
	HIA: {
		rootName: 'ebicsUnsecuredRequest',
		header: (ebicsAccount, orderDetails, productString) => {
			const ch = commonHeader(ebicsAccount, orderDetails, productString);

			delete ch.static.Nonce;
			delete ch.static.Timestamp;

			return ch;
		},
		body: (ebicsAccount, keys, xmlOptions) => ({
			DataTransfer: {
				OrderData: Buffer.from(zlib.deflateSync(orderData(ebicsAccount, keys, xmlOptions))).toString('base64'),
			},
		}),
	},
	HPB: {
		rootName: 'ebicsNoPubKeyDigestsRequest',
		header: (ebicsAccount, orderDetails, productString) => commonHeader(ebicsAccount, orderDetails, productString),
		body: () => ({}),
	},
};

module.exports = {
	use(order, client) {
		const keys = client.keys();
		const { orderDetails, transactionId } = order;
		const { xmlOptions, xmlSchema, productString } = genericSerializer(client.host, transactionId);
		const orderType = orderDetails.OrderType.toUpperCase();
		const ebicsAccount = {
			partnerId: client.partnerId,
			userId: client.userId,
			hostId: client.hostId,
		};

		this.rootName = process[orderType].rootName;
		this.xmlOptions = xmlOptions;
		this.xmlSchema = xmlSchema;

		this.xmlSchema.header = process[orderType].header(ebicsAccount, orderDetails, productString);
		this.xmlSchema.body = process[orderType].body(ebicsAccount, keys, this.xmlOptions);

		if (orderType !== 'HPB' && Object.prototype.hasOwnProperty.call(this.xmlSchema, 'AuthSignature'))
			delete this.xmlSchema.AuthSignature;

		return this;
	},

	toXML() {
		return js2xmlparser.parse(this.rootName, this.xmlSchema, this.xmlOptions);
	},
};
