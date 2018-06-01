'use strict';

const GenericOrder = require('./GenericOrder');

module.exports = class HPB extends GenericOrder {
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
					OrderType: 'HPB',
					OrderAttribute: 'DZHNN',
				},
				SecurityMedium: '0000',
			},
			mutable: {},
		};
	}

	root() { // eslint-disable-line class-methods-use-this
		return 'ebicsNoPubKeyDigestsRequest';
	}
};
