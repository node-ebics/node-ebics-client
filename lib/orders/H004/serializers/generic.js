'use strict';

const constants = require('../../../consts');

const rootName = 'ebicsRequest';
const rootAttributes = {
	'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#',
	xmlns: 'urn:org:ebics:H004',
	Version: 'H004',
	Revision: '1',
};
const header = {};
const authSignature = ({
	'ds:SignedInfo': {
		'ds:CanonicalizationMethod': {
			'@': {
				Algorithm:
						'http://www.w3.org/TR/2001/REC-xml-c14n-20010315',
			},
		},
		'ds:SignatureMethod': {
			'@': {
				Algorithm:
						'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256',
			},
		},
		'ds:Reference': {
			'@': { URI: "#xpointer(//*[@authenticate='true'])" },
			'ds:Transforms': {
				'ds:Transform': {
					'@': {
						Algorithm:
								'http://www.w3.org/TR/2001/REC-xml-c14n-20010315',
					},
				},
			},
			'ds:DigestMethod': {
				'@': {
					Algorithm:
							'http://www.w3.org/2001/04/xmlenc#sha256',
				},
			},
			'ds:DigestValue': {},
		},
	},
	'ds:SignatureValue': {},
});
const body = {};

const xmlOptions = {
	declaration: {
		include: true,
		encoding: 'utf-8',
	},
	format: {
		doubleQuotes: true,
		indent: '',
		newline: '',
		pretty: true,
	},
};

module.exports = (hostId, transactionId) => ({
	// return {
	productString: constants.productString,
	rootName,
	xmlOptions,
	xmlSchema: {
		'@': rootAttributes,
		header,
		AuthSignature: authSignature,
		body,
	},

	receipt() {
		this.xmlSchema = {
			'@': rootAttributes,

			header: {
				'@': { authenticate: true },
				static: {
					HostID: hostId,
					TransactionID: transactionId,
				},
				mutable: {
					TransactionPhase: 'Receipt',
				},
			},

			AuthSignature: authSignature,

			body: {
				TransferReceipt: {
					'@': { authenticate: true },
					ReceiptCode: 0,
				},
			},
		};

		return this;
	},

	transfer(encryptedOrderData) {
		this.xmlSchema = {
			'@': rootAttributes,

			header: {
				'@': { authenticate: true },
				static: {
					HostID: hostId,
					TransactionID: transactionId,
				},
				mutable: {
					TransactionPhase: 'Transfer',
					SegmentNumber: {
						'@': { lastSegment: true },
						'#': 1,
					},
				},
			},

			AuthSignature: authSignature,

			body: {
				DataTransfer: {
					OrderData: encryptedOrderData,
				},
			},
		};

		return this;
	},
	// };
});
