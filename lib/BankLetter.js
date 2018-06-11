'use strict';

const moment = require('moment');
const handlebars = require('handlebars');
const BN = require('bn.js');

const registerHelpers = () => {
	handlebars.registerHelper('today', () => moment().format('DD.MM.YYYY'));

	handlebars.registerHelper('now', () => moment().format('HH:mm:ss'));

	handlebars.registerHelper('keyExponentBits', k => Buffer.byteLength(new BN(k.key.keyPair.e).toBuffer()) * 8);

	handlebars.registerHelper('keyModulusBits', k => k.key.getKeySize());
	// return Buffer.byteLength(new BN(k.key.keyPair.e).toBuffer()) * 8;

	handlebars.registerHelper('keyExponent', k => k.e('hex'));

	handlebars.registerHelper('keyModulus', k => k.n('hex').toUpperCase().match(/.{1,2}/g).join(' '));

	handlebars.registerHelper('sha256', (k) => {
		const digest = Buffer.from(k.publicDigest(), 'base64').toString('HEX');

		return digest.toUpperCase().match(/.{1,2}/g).join(' ');
	});
};
module.exports = class BankLetter {
	constructor({
		client,
		bankName,
		template,
	}) {
		this.client = client;
		this.bankName = bankName;
		this.template = template;
	}


	generate() {
		registerHelpers();

		const templ = handlebars.compile(this.template);

		const data = {
			bankName: this.bankName,
			userId: this.client.userId,
			partnerId: this.client.partnerId,
			A006: this.client.a(),
			X002: this.client.x(),
			E002: this.client.e(),
		};

		return templ(data);
	}
};
