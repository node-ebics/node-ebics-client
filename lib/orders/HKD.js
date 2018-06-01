'use strict';

const GenericOrder = require('./GenericOrder');

module.exports = class HKD extends GenericOrder {
	constructor(client) {
		super(client);

		this._schema.header = {
			'@': { authenticate: true },
			static: {
				HostID: this.hostId,
				Nonce: this.nonce(),
				Timestamp: this.timestamp(),
				PartnerID: this.partnerId,
				UserID: this.userId,
				Product: {
					'@': { Language: 'de' },
					'#': this.productString,
				},
				OrderDetails: {
					OrderType: 'HKD',
					OrderAttribute: 'DZHNN',
					StandardOrderParams: '',
				},
				BankPubKeyDigests: {
					Authentication: {
						'@': { Version: 'X002', Algorithm: 'http://www.w3.org/2001/04/xmlenc#sha256' },
						'#': this.client.bankX().publicDigest(),
					},
					Encryption: {
						'@': { Version: 'E002', Algorithm: 'http://www.w3.org/2001/04/xmlenc#sha256' },
						'#': this.client.bankE().publicDigest(),
					},
				},
				SecurityMedium: '0000',
			},
			mutable: {
				TransactionPhase: 'Initialisation',
			},
		};
	}
};
