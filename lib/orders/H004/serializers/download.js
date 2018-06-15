'use strict';

const js2xmlparser = require('js2xmlparser');

const Crypto = require('../../../crypto/Crypto');

const genericSerializer = require('./generic');

module.exports = {
	use(orderBuilder) {
		const {
			ebicsData, orderDetails, keys, productString, transactionId,
		} = orderBuilder;
		const {
			rootName, xmlOptions, xmlSchema, receipt, transfer,
		} = genericSerializer(orderBuilder);

		this.rootName = rootName;
		this.xmlOptions = xmlOptions;
		this.xmlSchema = xmlSchema;
		this.receipt = receipt;
		this.transfer = transfer;

		if (transactionId) return this.receipt();

		this.xmlSchema.header = {
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
				BankPubKeyDigests: {
					Authentication: {
						'@': { Version: 'X002', Algorithm: 'http://www.w3.org/2001/04/xmlenc#sha256' },
						'#': Crypto.digestPublicKey(keys.bankX()),
					},
					Encryption: {
						'@': { Version: 'E002', Algorithm: 'http://www.w3.org/2001/04/xmlenc#sha256' },
						'#': Crypto.digestPublicKey(keys.bankE()),
					},
				},
				SecurityMedium: '0000',
			},
			mutable: {
				TransactionPhase: 'Initialisation',
			},
		};

		return this;
	},

	toXML() {
		return js2xmlparser.parse(this.rootName, this.xmlSchema, this.xmlOptions);
	},
};
