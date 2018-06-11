'use strict';

const js2xmlparser = require('js2xmlparser');

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

module.exports = class GenericSerializer {
	constructor(orderBuilder) {
		this._order = orderBuilder;
		this._orderDetails = orderBuilder.orderDetails;
		this._hostId = orderBuilder.hostId;
		this._partnerId = orderBuilder.partnerId;
		this._userId = orderBuilder.userId;
		this._keys = orderBuilder.keys;
		this._transactionId = orderBuilder.transactionId;
		this._rootName = orderBuilder.root.nodeName;
		this._rootAttributes = orderBuilder.root.nodeAttributes;

		this._xmlOptions = xmlOptions;
		this._xml = {};
	}

	static authSignature() {
		return authSignature;
	}

	get keys() {
		return this._keys;
	}

	toXML() {
		return js2xmlparser.parse(this._rootName, this._xml, this._xmlOptions);
	}
};
