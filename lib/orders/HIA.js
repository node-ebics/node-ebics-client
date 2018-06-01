'use strict';

const zlib = require('zlib');
const js2xmlparser = require('js2xmlparser');

const GenericOrder = require('./GenericOrder');

module.exports = class HIA extends GenericOrder {
	constructor(client) {
		super(client);

		this._schema = {
			'@': {
				'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#',
				xmlns: 'urn:org:ebics:H004',
				Version: 'H004',
				Revision: '1',
			},

			header: {
				'@': { authenticate: true },
				static: {
					HostID: this.hostId,
					PartnerID: this.partnerId,
					UserID: this.userId,
					Product: {
						'@': { Language: 'de' },
						'#': this.productString,
					},
					OrderDetails: {
						OrderType: 'HIA',
						OrderAttribute: 'DZNNN',
					},
					SecurityMedium: '0000',
				},
				mutable: {},
			},

			body: {
				DataTransfer: {
					OrderData: Buffer.from(zlib.deflateSync(this.orderData())).toString('base64'),
				},
			},
		};
	}

	root() { // eslint-disable-line class-methods-use-this
		return 'ebicsUnsecuredRequest';
	}

	orderData() {
		const xmlOrderData = {
			'@': {
				'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#',
				xmlns: 'urn:org:ebics:H004',
			},
			AuthenticationPubKeyInfo: {
				PubKeyValue: {
					'ds:RSAKeyValue': {
						'ds:Modulus': Buffer.from(this.client.x().n(), 'HEX').toString('base64'),
						'ds:Exponent': 'AQAB',
					},
				},
				AuthenticationVersion: 'X002',
			},
			EncryptionPubKeyInfo: {
				PubKeyValue: {
					'ds:RSAKeyValue': {
						'ds:Modulus': Buffer.from(this.client.e().n(), 'HEX').toString('base64'),
						'ds:Exponent': 'AQAB',
					},
				},
				EncryptionVersion: 'E002',
			},
			PartnerID: this.partnerId,
			UserID: this.userId,
		};

		return js2xmlparser.parse('HIARequestOrderData', xmlOrderData, this.xmlOptions);
	}

	toXML() {
		return js2xmlparser.parse(this.root(), this._schema, this.xmlOptions);
	}
};
