'use strict';

const zlib = require('zlib');
const js2xmlparser = require('js2xmlparser');

const GenericOrder = require('./GenericOrder');

module.exports = class INI extends GenericOrder {
	constructor (client) {
		super(client);

		this._schema = {
			"@": {
				"xmlns:ds": "http://www.w3.org/2000/09/xmldsig#",
				xmlns: "urn:org:ebics:H004",
				Version: "H004",
				Revision: "1"
			},

			header: {
				"@": { authenticate: true },
				static: {
					HostID: this.hostId,
					PartnerID: this.partnerId,
					UserID: this.userId,
					Product: {
						"@": { Language: "de" },
						"#": this.productString,
					},
					OrderDetails: {
						OrderType: "INI",
						OrderAttribute: "DZNNN"
					},
					SecurityMedium: "0000"
				},
				mutable: {}
			},

			body: {
				DataTransfer: {
					OrderData: Buffer.from(zlib.deflateSync(this.keySignature())).toString('base64')
				}
			}
		};
	}

	root() {
		return "ebicsUnsecuredRequest";
	};

	keySignature() {
		const xmlOrderData = {
			"@": {
				"xmlns:ds": "http://www.w3.org/2000/09/xmldsig#",
				xmlns: "http://www.ebics.org/S001"
			},
			SignaturePubKeyInfo: {
				PubKeyValue: {
					"ds:RSAKeyValue": {
						"ds:Modulus": Buffer.from(this.client.a().n(), 'HEX').toString('base64'),
						"ds:Exponent": "AQAB"
					},
					TimeStamp: this.timestamp()
				},
				SignatureVersion: "A006"
			},
			PartnerID: this.partnerId,
			UserID: this.userId
		};

		return js2xmlparser.parse("SignaturePubKeyOrderData", xmlOrderData, this.xmlOptions);
	};

	toXML() {
		return js2xmlparser.parse(this.root(), this._schema, this.xmlOptions);
	}
};
