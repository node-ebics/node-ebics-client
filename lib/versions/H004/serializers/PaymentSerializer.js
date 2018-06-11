'use strict';

const zlib = require('zlib');
const crypto = require('crypto');

const js2xmlparser = require('js2xmlparser');

const consts = require('../../../consts');
const Crypto = require('../../../crypto/Crypto');

const GenericSerializer = require('./GenericSerializer');

module.exports = class PaymentSerializer extends GenericSerializer {
	constructor(order) {
		super(order);

		this._transactionKey = order.transactionKey;

		this._xml = {
			'@': this._rootAttributes,
			header: {
				'@': { authenticate: true },
				static: {
					HostID: this._hostId,
					Nonce: Crypto.nonce(),
					Timestamp: Crypto.timestamp(),
					PartnerID: this._partnerId,
					UserID: this._userId,
					Product: {
						'@': { Language: 'en' },
						'#': consts.productString,
					},
					OrderDetails: this._orderDetails,
					BankPubKeyDigests: {
						Authentication: {
							'@': { Version: 'X002', Algorithm: 'http://www.w3.org/2001/04/xmlenc#sha256' },
							'#': Crypto.digestPublicKey(this._keys.bankX()),
						},
						Encryption: {
							'@': { Version: 'E002', Algorithm: 'http://www.w3.org/2001/04/xmlenc#sha256' },
							'#': Crypto.digestPublicKey(this._keys.bankE()),
						},
					},
					SecurityMedium: '0000',
					NumSegments: 1,
				},
				mutable: {
					TransactionPhase: 'Initialisation',
				},
			},
			AuthSignature: GenericSerializer.authSignature(),
			body: {
				DataTransfer: {
					DataEncryptionInfo: {
						'@': { authenticate: true },
						EncryptionPubKeyDigest: {
							'@': { Version: 'E002', Algorithm: 'http://www.w3.org/2001/04/xmlenc#sha256' },
							'#': Crypto.digestPublicKey(this._keys.bankE()),
						},
						TransactionKey: Crypto.publicEncrypt(this._keys.bankE(), this._transactionKey).toString('base64'),
					},
					SignatureData: {
						'@': { authenticate: true },
						'#': this.encryptedOrderSignature(),
					},
				},
			},
		};

		if (order.hasTransactionId()) {
			this._xml.header = {
				'@': { authenticate: true },
				static: {
					HostID: this._hostId,
					TransactionID: this._transactionId,
				},
				mutable: {
					TransactionPhase: 'Transfer',
					SegmentNumber: {
						'@': { lastSegment: true },
						'#': 1,
					},
				},
			};

			this._xml.body = {
				DataTransfer: {
					OrderData: this.encryptedOrderData(),
				},
			};
		}
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
				PartnerID: this._partnerId,
				UserID: this._userId,
			},
		};

		return js2xmlparser.parse('UserSignatureData', xmlObj, this._xmlOptions);
	}

	signatureValue() {
		const digested = Crypto.digestWithHash(this._order.document.replace(/\n|\r/g, ''));

		return Crypto.sign(this._keys.a(), digested);
	}

	encryptedOrderData() {
		const dst = zlib.deflateSync(this._order.document.replace(/\n|\r/g, ''));
		const cipher = crypto.createCipheriv('aes-128-cbc', this._transactionKey, Buffer.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])).setAutoPadding(false);

		return Buffer.concat([cipher.update(Crypto.pad(dst)), cipher.final()]).toString('base64');
	}

	encryptedOrderSignature() {
		const dst = zlib.deflateSync(this.orderSignature());
		const cipher = crypto.createCipheriv('aes-128-cbc', this._transactionKey, Buffer.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])).setAutoPadding(false);

		return Buffer.concat([cipher.update(Crypto.pad(dst)), cipher.final()]).toString('base64');
	}
};
