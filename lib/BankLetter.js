'use strict';

const fs = require('fs');

const handlebars = require('handlebars');
const Crypto = require('./crypto/Crypto');
const { date } = require('./utils.js');

const registerHelpers = () => {
	handlebars.registerHelper('today', () => date.toISODate(Date.now(), false));

	handlebars.registerHelper('now', () => date.toISOTime(Date.now(), false));

	handlebars.registerHelper('keyExponentBits', k => Buffer.byteLength(k.e()) * 8);

	handlebars.registerHelper('keyModulusBits', k => k.size());

	handlebars.registerHelper('keyExponent', k => k.e('hex'));

	handlebars.registerHelper('keyModulus', k => k.n('hex').toUpperCase().match(/.{1,2}/g).join(' '));

	handlebars.registerHelper('sha256', (k) => {
		const digest = Buffer.from(Crypto.digestPublicKey(k), 'base64').toString('HEX');
		return digest.toUpperCase().match(/.{1,2}/g).join(' ');
	});
};

const writeFile = (file, content) => new Promise((resolve, reject) => fs.writeFile(file, content, (err, result) => {
	if (err)
		return reject(err);
	return resolve(result);
}));
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
		await writeFile(path, letter);
		return true;
	}
};
