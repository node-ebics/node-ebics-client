'use strict';

const fs = require('fs');

const moment     = require('moment');
const handlebars = require('handlebars');
const BN         = require("bn.js");

module.exports = class BankLetter {
	constructor(client, bankName) {
		this.client         = client;
		this.bankName       = bankName;
		this.pathToTemplate = './app/ebics/ini.hbs';
	};

	_registerHelpers() {
		handlebars.registerHelper("today", () => {
			return moment().format('DD.MM.YYYY');
		});

		handlebars.registerHelper("now", () => {
			return moment().format('HH:mm:ss');
		});

		handlebars.registerHelper("keyExponentBits", (k) => {
			return Buffer.byteLength(new BN(k.key.keyPair.e).toBuffer()) * 8;
		});

		handlebars.registerHelper("keyModulusBits", (k) => {
			return k.key.getKeySize();
			// return Buffer.byteLength(new BN(k.key.keyPair.e).toBuffer()) * 8;
		});

		handlebars.registerHelper("keyExponent", (k) => {
			return k.e();
		});

		handlebars.registerHelper("keyModulus", (k) => {
			return k.n().toUpperCase().match(/.{1,2}/g).join(' ');
		});

		handlebars.registerHelper("sha256", (k) => {
			const digest = Buffer.from(k.publicDigest(), 'base64').toString('HEX');

			return digest.toUpperCase().match(/.{1,2}/g).join(' ');
		});
	};

	generate() {
		this._registerHelpers();

		const str   = fs.readFileSync(this.pathToTemplate).toString();
		const templ = handlebars.compile(str);

		const data = {
			bankName : this.bankName,
			userId   : this.client.userId,
			partnerId: this.client.partnerId,
			A006     : this.client.a(),
			X002     : this.client.x(),
			E002     : this.client.e(),
		};

		return templ(data);
	}
}
