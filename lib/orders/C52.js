'use strict';

const GenericOrder = require('./GenericOrder');

module.exports = class C52 extends GenericOrder {
	constructor (client, from, to) {
		super(client);
		this._from = from;
		this._to   = to;

		this._schema.header = {
			"@"   : { authenticate: true },
			static: {
				HostID   : this.hostId,
				Nonce    : this.nonce(),
				Timestamp: this.timestamp(),
				PartnerID: this.partnerId,
				UserID   : this.userId,
				Product  : {
					"@": { Language: "de" },
					"#": this.productString,
				},
				OrderDetails: {
					OrderType          : "C52",
					OrderAttribute     : "DZHNN",
					StandardOrderParams: {
						DateRange: {
							Start: this._from,
							End  : this._to
						}
					},
				},
				BankPubKeyDigests: {
					Authentication: {
						"@": { Version: "X002", Algorithm: "http://www.w3.org/2001/04/xmlenc#sha256" },
						"#": this.client.bankX().publicDigest()
					},
					Encryption: {
						"@": { Version: "E002", Algorithm: "http://www.w3.org/2001/04/xmlenc#sha256" },
						"#": this.client.bankE().publicDigest()
					}
				},
				SecurityMedium: "0000"
			},
			mutable: {
				TransactionPhase: "Initialisation"
			}
		};
	};
};
