'use strict';

const zlib = require('zlib');
const js2xmlparser = require('js2xmlparser');

const consts = require('../../consts');
const Crypto = require('../../crypto/Crypto');

const GenericSerializer = require('./GenericSerializer');

module.exports = class InitializationSerializer extends GenericSerializer {
	constructor(order) {
		super(order);

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
					SecurityMedium: '0000',
				},
				mutable: {},
			},
		};

		if (this._isINI() || this._isHIA()) {
			delete this._xml.header.static.Nonce;
			delete this._xml.header.static.Timestamp;

			this._xml.body = {
				DataTransfer: {
					OrderData: this.orderData(),
				},
			};
		} else {
			this._rootName = 'ebicsNoPubKeyDigestsRequest';
			this._xml.AuthSignature = GenericSerializer.authSignature();
			this._xml.body = {};
		}
	}

	orderData() {
		if (this._isINI()) return this._iniKeySignature();
		if (this._isHIA()) return this._hiaOrderData();

		return '';
	}

	_iniKeySignature() {
		const xmlOrderData = {
			'@': {
				'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#',
				xmlns: 'http://www.ebics.org/S001',
			},
			SignaturePubKeyInfo: {
				PubKeyValue: {
					'ds:RSAKeyValue': {
						'ds:Modulus': Buffer.from(this._keys.a().n(), 'HEX').toString('base64'),
						'ds:Exponent': this._keys.a().e().toString('base64'),
					},
					TimeStamp: Crypto.timestamp(),
				},
				SignatureVersion: 'A006',
			},
			PartnerID: this._partnerId,
			UserID: this._userId,
		};

		const signature = js2xmlparser.parse('SignaturePubKeyOrderData', xmlOrderData, this._xmlOptions);

		return Buffer.from(zlib.deflateSync(signature)).toString('base64');
	}

	_hiaOrderData() {
		const xmlOrderData = {
			'@': {
				'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#',
				xmlns: 'urn:org:ebics:H004',
			},
			AuthenticationPubKeyInfo: {
				PubKeyValue: {
					'ds:RSAKeyValue': {
						'ds:Modulus': Buffer.from(this._keys.x().n(), 'HEX').toString('base64'),
						'ds:Exponent': this._keys.x().e().toString('base64'),
					},
				},
				AuthenticationVersion: 'X002',
			},
			EncryptionPubKeyInfo: {
				PubKeyValue: {
					'ds:RSAKeyValue': {
						'ds:Modulus': Buffer.from(this.keys.e().n(), 'HEX').toString('base64'),
						'ds:Exponent': this._keys.e().e().toString('base64'),
					},
				},
				EncryptionVersion: 'E002',
			},
			PartnerID: this._partnerId,
			UserID: this._userId,
		};

		const order = js2xmlparser.parse('HIARequestOrderData', xmlOrderData, this._xmlOptions);

		return Buffer.from(zlib.deflateSync(order)).toString('base64');
	}

	_isINI() {
		return this._orderDetails.OrderType.toUpperCase() === 'INI';
	}

	_isHIA() {
		return this._orderDetails.OrderType.toUpperCase() === 'HIA';
	}

	_isHPB() {
		return this._orderDetails.OrderType.toUpperCase() === 'HPB';
	}
};
