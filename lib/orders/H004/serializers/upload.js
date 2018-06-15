'use strict';

const zlib = require('zlib');
const crypto = require('crypto');

const js2xmlparser = require('js2xmlparser');

const Crypto = require('../../../crypto/Crypto');

const downloadSerializer = require('./download');

const signatureValue = (document, key) => {
	const digested = Crypto.digestWithHash(document.replace(/\n|\r/g, ''));

	return Crypto.sign(key, digested);
};
const orderSignature = (ebicsData, document, key, xmlOptions) => {
	const xmlObj = {
		'@': {
			xmlns: 'http://www.ebics.org/S001',
			'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
			'xsi:schemaLocation': 'http://www.ebics.org/S001 http://www.ebics.org/S001/ebics_signature.xsd',
		},
		OrderSignatureData: {
			SignatureVersion: 'A006',
			SignatureValue: signatureValue(document, key),
			PartnerID: ebicsData.partnerId,
			UserID: ebicsData.userId,
		},
	};

	return js2xmlparser.parse('UserSignatureData', xmlObj, xmlOptions);
};
const encryptedOrderSignature = (ebicsData, document, transactionKey, key, xmlOptions) => {
	const dst = zlib.deflateSync(orderSignature(ebicsData, document, key, xmlOptions));
	const cipher = crypto.createCipheriv('aes-128-cbc', transactionKey, Buffer.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])).setAutoPadding(false);

	return Buffer.concat([cipher.update(Crypto.pad(dst)), cipher.final()]).toString('base64');
};
const encryptedOrderData = (document, transactionKey) => {
	const dst = zlib.deflateSync(document.replace(/\n|\r/g, ''));
	const cipher = crypto.createCipheriv('aes-128-cbc', transactionKey, Buffer.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])).setAutoPadding(false);

	return Buffer.concat([cipher.update(Crypto.pad(dst)), cipher.final()]).toString('base64');
};

module.exports = {
	use(orderBuilder) {
		const {
			ebicsData, keys, transactionId, transactionKey, document,
		} = orderBuilder;
		const {
			rootName, xmlOptions, xmlSchema, transfer,
		} = downloadSerializer.use(orderBuilder);

		this.rootName = rootName;
		this.xmlOptions = xmlOptions;
		this.xmlSchema = xmlSchema;
		this.transfer = transfer;

		if (transactionId) return this.transfer(encryptedOrderData(document, transactionKey));

		this.xmlSchema.header.static.NumSegments = 1;

		this.xmlSchema.body = {
			DataTransfer: {
				DataEncryptionInfo: {
					'@': { authenticate: true },
					EncryptionPubKeyDigest: {
						'@': { Version: 'E002', Algorithm: 'http://www.w3.org/2001/04/xmlenc#sha256' },
						'#': Crypto.digestPublicKey(keys.bankE()),
					},
					TransactionKey: Crypto.publicEncrypt(keys.bankE(), transactionKey).toString('base64'),
				},
				SignatureData: {
					'@': { authenticate: true },
					'#': encryptedOrderSignature(ebicsData, document, transactionKey, keys.a(), this.xmlOptions),
				},
			},
		};

		return this;
	},

	toXML() {
		return js2xmlparser.parse(this.rootName, this.xmlSchema, this.xmlOptions);
	},
};
