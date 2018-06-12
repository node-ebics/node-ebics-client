'use strict';

const Crypto = require('../../../crypto/Crypto');

const GenericSerializer = require('./GenericSerializer');

module.exports = class StatusSerializer extends GenericSerializer {
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
						'#': this._productString,
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
				},
				mutable: {
					TransactionPhase: 'Initialisation',
				},
			},
			AuthSignature: GenericSerializer.authSignature(),
			body: {},
		};

		if (order.hasTransactionId()) {
			this._xml.header = {
				'@': { authenticate: true },
				static: {
					HostID: this._hostId,
					TransactionID: this._transactionId,
				},
				mutable: {
					TransactionPhase: 'Receipt',
				},
			};

			this._xml.body = {
				TransferReceipt: {
					'@': { authenticate: true },
					ReceiptCode: 0,
				},
			};
		}
	}
};
