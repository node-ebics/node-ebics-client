'use strict';

const fs = require('fs');

const moment = require('moment');
const handlebars = require('handlebars');
const Crypto = require('./crypto/Crypto');
// const BN = require('bn.js');

const registerHelpers = () => {
	handlebars.registerHelper('today', () => moment().format('DD.MM.YYYY'));

	handlebars.registerHelper('now', () => moment().format('HH:mm:ss'));

	handlebars.registerHelper('keyExponentBits', k => Buffer.byteLength(k.e()) * 8);
	// handlebars.registerHelper('keyExponentBits', k => Buffer.byteLength(new BN(k.key.keyPair.e).toBuffer()) * 8);

	handlebars.registerHelper('keyModulusBits', k => k.key.getKeySize());
	// return Buffer.byteLength(new BN(k.key.keyPair.e).toBuffer()) * 8;

	handlebars.registerHelper('keyExponent', k => k.e('hex'));

	handlebars.registerHelper('keyModulus', k => k.n('hex').toUpperCase().match(/.{1,2}/g).join(' '));

	handlebars.registerHelper('sha256', (k) => {
		const digest = Buffer.from(Crypto.digestPublicKey(k), 'base64').toString('HEX');
		// const digest = Buffer.from(k.publicDigest(), 'base64').toString('HEX');

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

		if ()
		this.template = template;

	}

	async generate() {
		registerHelpers();

		const templ = handlebars.compile(this.template);
		const keys = await this.client.keys();

		const data = {
			bankName: this.bankName,
			userId: this.client.userId,
			partnerId: this.client.partnerId,
			A006: keys.a(),
			X002: keys.x(),
			E002: keys.e(),
		};

		return templ(data);
	}

	async serialize(path) {
		const letter = await this.generate();

		try {
			fs.writeFileSync(path, letter);
			console.log('Data written to file');
		} catch (error) {
			console.log(error);
			throw error;
		}
		return new Promise(resolve => resolve(true));
	}
};
