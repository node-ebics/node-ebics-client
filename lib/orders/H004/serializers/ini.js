'use strict';

const zlib = require('zlib');

const js2xmlparser = require('js2xmlparser');

const Crypto = require('../../../crypto/Crypto');

const genericSerializer = require('./generic');

const keySignature = (ebicsData, key, xmlOptions) => {
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
		PartnerID: ebicsData.partnerId,
		UserID: ebicsData.userId,
	};

	return js2xmlparser.parse('SignaturePubKeyOrderData', xmlOrderData, xmlOptions);
};
const orderData = (ebicsData, keys, xmlOptions) => {
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
		PartnerID: ebicsData.partnerId,
		UserID: ebicsData.userId,
	};

	return js2xmlparser.parse('HIARequestOrderData', xmlOrderData, xmlOptions);
};
const commonHeader = (ebicsData, orderDetails, productString) => ({
	'@': { authenticate: true },
	static: {
		HostID: ebicsData.hostId,
		Nonce: Crypto.nonce(),
		Timestamp: Crypto.timestamp(),
		PartnerID: ebicsData.partnerId,
		UserID: ebicsData.userId,
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
		header: (ebicsData, orderDetails, productString) => {
			const ch = commonHeader(ebicsData, orderDetails, productString);

			delete ch.static.Nonce;
			delete ch.static.Timestamp;

			return ch;
		},
		body: (ebicsData, keys, xmlOptions) => ({
			DataTransfer: {
				OrderData: Buffer.from(zlib.deflateSync(keySignature(ebicsData, keys.a(), xmlOptions))).toString('base64'),
			},
		}),
	},
	HIA: {
		rootName: 'ebicsUnsecuredRequest',
		header: (ebicsData, orderDetails, productString) => {
			const ch = commonHeader(ebicsData, orderDetails, productString);

			delete ch.static.Nonce;
			delete ch.static.Timestamp;

			return ch;
		},
		body: (ebicsData, keys, xmlOptions) => ({
			DataTransfer: {
				OrderData: Buffer.from(zlib.deflateSync(orderData(ebicsData, keys, xmlOptions))).toString('base64'),
			},
		}),
	},
	HPB: {
		rootName: 'ebicsNoPubKeyDigestsRequest',
		header: (ebicsData, orderDetails, productString) => commonHeader(ebicsData, orderDetails, productString),
		body: () => ({}),
	},
};

module.exports = {
	use(orderBuilder) {
		const { xmlOptions, xmlSchema } = genericSerializer(orderBuilder);
		const {
			ebicsData, orderDetails, keys, productString,
		} = orderBuilder;
		const orderType = orderDetails.OrderType.toUpperCase();

		this.rootName = process[orderType].rootName;
		this.xmlOptions = xmlOptions;
		this.xmlSchema = xmlSchema;

		this.xmlSchema.header = process[orderType].header(ebicsData, orderDetails, productString);
		this.xmlSchema.body = process[orderType].body(ebicsData, keys, this.xmlOptions);

		if (orderType !== 'HPB' && Object.prototype.hasOwnProperty.call(this.xmlSchema, 'AuthSignature'))
			delete this.xmlSchema.AuthSignature;

		return this;
	},

	toXML() {
		return js2xmlparser.parse(this.rootName, this.xmlSchema, this.xmlOptions);
	},
};
