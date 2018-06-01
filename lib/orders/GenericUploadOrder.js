'use strict';

const zlib = require('zlib');
const crypto = require('crypto');

const js2xmlparser = require('js2xmlparser');

const GenericOrder = require('./GenericOrder');

const pad = (d) => {
	const dLen = d.length;
	const len = 16 * (Math.trunc(dLen / 16) + 1);

	return Buffer.concat([d, Buffer.from(Buffer.from([0]).toString().repeat(len - dLen - 1)), Buffer.from([len - dLen])]);
};

module.exports = class GenericUploadOrder extends GenericOrder {
	constructor(client, document) {
		super(client);

		this._document = document;
		this._key = crypto.randomBytes(16);

		this._schema.body = {
			DataTransfer: {
				DataEncryptionInfo: {
					'@': { authenticate: true },
					EncryptionPubKeyDigest: {
						'@': { Version: 'E002', Algorithm: 'http://www.w3.org/2001/04/xmlenc#sha256' },
						'#': this.client.bankE().publicDigest(),
					},
					TransactionKey: this.client.bankE().publicEncrypt(this._key).toString('base64'),
				},
				SignatureData: {
					'@': { authenticate: true },
					'#': this.encryptedOrderSignature(),
				},
			},
		};
	}

	orderSignature() {
		const xmlObj = {
			'@': {
				xmlns: 'http://www.ebics.org/S001',
				'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
				'xsi:schemaLocation': 'http://www.ebics.org/S001 http://www.ebics.org/S001/ebics_signature.xsd',
			},
			OrderSignatureData: {
				SignatureVersion: 'A006',
				SignatureValue: this.signatureValue(),
				PartnerID: this.partnerId,
				UserID: this.userId,
			},
		};

		return js2xmlparser.parse('UserSignatureData', xmlObj, this.xmlOptions);
	}

	signatureValue() {
		const digested = crypto.createHash('sha256').update(this._document.replace(/\n|\r/g, '')).digest();

		return this.client.a().sign(digested);
	}

	encryptedOrderData() {
		const dst = zlib.deflateSync(this._document.replace(/\r|\n/g, ''));
		const cipher = crypto.createCipheriv('aes-128-cbc', this._key, Buffer.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])).setAutoPadding(false);

		return Buffer.concat([cipher.update(pad(dst)), cipher.final()]).toString('base64');
	}

	encryptedOrderSignature() {
		const dst = zlib.deflateSync(this.orderSignature());
		const cipher = crypto.createCipheriv('aes-128-cbc', this._key, Buffer.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])).setAutoPadding(false);

		return Buffer.concat([cipher.update(pad(dst)), cipher.final()]).toString('base64');
	}
};
