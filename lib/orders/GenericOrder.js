'use strict';

// const randHex = require('../../lib/utils').randHex;
const crypto       = require("crypto");
const js2xmlparser = require('js2xmlparser');
const consts       = require('../consts');

module.exports = class GenericOrder {
	constructor(client) {
		this.client = client;

		this.hostId = client.hostId;
		this.userId = client.userId;
		this.partnerId = client.partnerId;

		this.transactionId = '';

		this.xmlOptions = {
			declaration: {
				include: true,
				encoding: "utf-8"
			},
			format: {
				doubleQuotes: true,
				indent: '',
				newline: '',
				pretty: true
			}
		};

		this._schema = {
			"@": {
				"xmlns:ds": "http://www.w3.org/2000/09/xmldsig#",
				xmlns: "urn:org:ebics:H004",
				Version: "H004",
				Revision: "1"
			},

			header: {},

			AuthSignature: this.authSignature(),

			body: {}
		};
	}

	authSignature() {
		return {
			"ds:SignedInfo": {
				"ds:CanonicalizationMethod": {
					"@": {
						Algorithm:
							"http://www.w3.org/TR/2001/REC-xml-c14n-20010315"
					}
				},
				"ds:SignatureMethod": {
					"@": {
						Algorithm:
							"http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"
					}
				},
				"ds:Reference": {
					"@": { URI: "#xpointer(//*[@authenticate='true'])" },
					"ds:Transforms": {
						"ds:Transform": {
							"@": {
								Algorithm:
									"http://www.w3.org/TR/2001/REC-xml-c14n-20010315"
							}
						}
					},
					"ds:DigestMethod": {
						"@": {
							Algorithm:
								"http://www.w3.org/2001/04/xmlenc#sha256"
						}
					},
					"ds:DigestValue": {}
				}
			},
			"ds:SignatureValue": {}
		};
	}

	get schema() {
		return this._schema;
	}

	get productString() {
		return consts.productString;
	}

	nonce() {
		return crypto.randomBytes(16).toString('hex');
	}

	timestamp() {
		return new Date().toISOString();
	}

	root() {
		return "ebicsRequest";
	}

	toReceiptXML() {
		const xmlObj = {
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
					TransactionID: this.transactionId
				},
				mutable: {
					TransactionPhase: 'Receipt',
				}
			},

			AuthSignature: this.authSignature(),

			body: {
				TransferReceipt: {
					"@": { authenticate: true },
					ReceiptCode: 0
				}
			}
		};

		return js2xmlparser.parse(this.root(), xmlObj, this.xmlOptions);
	}

	toTransferXML(){
		const xmlObj = {
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
					TransactionID: this.transactionId
				},
				mutable: {
					TransactionPhase: 'Transfer',
					SegmentNumber: {
						"@": { lastSegment: true },
						"#": 1
					}
				}
			},

			AuthSignature: this.authSignature(),

			body: {
				DataTransfer: {
					OrderData: this.encryptedOrderData()
				}
			}
		};

		return js2xmlparser.parse(this.root(), xmlObj, this.xmlOptions);
	}

	encryptedOrderData() {
	}

	toXML() {
		return js2xmlparser.parse(this.root(), this._schema, this.xmlOptions);
	}
};
