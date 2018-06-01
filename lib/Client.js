'use strict';

const fs = require('fs');
const path = require('path');

const crypto = require('crypto');
const $request = require('request');

const BN = require('bn.js');
const xpath = require('xpath');
const NodeRSA 		= require('node-rsa');
const { DOMParser } = require('xmldom');

const Key = require('./Key');
const XMLSign = require('./middleware/XMLSign');
const ParseResponse = require('./middleware/ParseResponse');
const BankLetter = require('./BankLetter');
const EBICSINI = require('./orders/INI');
const EBICSHIA = require('./orders/HIA');
const EBICSHPB = require('./orders/HPB');
const EBICSHKD = require('./orders/HKD');
const EBICSHAA = require('./orders/HAA');
const EBICSHAC = require('./orders/HAC');
const EBICSHTD = require('./orders/HTD');
const EBICSC52 = require('./orders/C52');

const defaultIniTemplatePath = path.join(__dirname, '../templates/ini.hbs');

const utils = {
	exponent: {
		// str = 65537 => AQAB
		toBase64(str) {
			return new BN(str).toBuffer().toString('base64');
		},
		// str = AQAB => 65537
		fromBase64(str) {
			return new BN(Buffer.from(str, 'base64'), 2).toNumber();
		},
	},
};
module.exports = class Client {
	constructor(keysContent, passphrase, url, hostId, userId, partnerId) {
		this.keysContent = keysContent;
		this.passphrase = passphrase;
		this.url = url;
		this.hostId = hostId;
		this.userId = userId;
		this.partnerId = partnerId;
		this.encryptAlgorithm = 'aes-256-cbc';
		this.keys = keysContent ? this.extractKeys() : {};
	}

	a() {
		return this.keys.A006;
	}

	e() {
		return this.keys.E002;
	}

	x() {
		return this.keys.X002;
	}

	bankX() {
		return this.keys[`${this.hostId}.X002`];
	}

	bankE() {
		return this.keys[`${this.hostId}.E002`];
	}

	encrypt(data) {
		const cipher = crypto.createCipher(this.encryptAlgorithm, this.passphrase);
		const encrypted = cipher.update(data, 'utf8', 'hex') + cipher.final('hex');

		return Buffer.from(encrypted).toString('base64');
	}

	decrypt(data) {
		data = (new Buffer(data, 'base64')).toString(); // eslint-disable-line no-buffer-constructor

		const decipher = crypto.createDecipher(this.encryptAlgorithm, this.passphrase);
		const decrypted = decipher.update(data, 'hex', 'utf8') + decipher.final('utf8');

		return decrypted;
	}

	static setup(passphrase, url, hostId, userId, partnerId, keysize = 2048) {
		const client = new Client(null, passphrase, url, hostId, userId, partnerId);

		Object.keys({ A006: '', X002: '', E002: '' }).forEach((key) => {
			client.keys[key] = new Key(new NodeRSA({ b: keysize }));
		});
		// for (const key in Object.keys({ A006: '', X002: '', E002: '' }))
		// 	client.keys[key] = new Key(new NodeRSA({ b: keysize }));


		return client;
	}

	saveIniLetter(bankName, target, template) {
		const letter = new BankLetter({
			client: this,
			bankName,
			template: template || fs.readFileSync(defaultIniTemplatePath, { encoding: 'utf8' }),
		});

		try {
			fs.writeFileSync(target, letter.generate());
		} catch (error) {
			throw error;
		}
	}

	saveKeys(target) {
		const data = {};

		Object.keys(this.keys).forEach((key) => {
			data[key] = this.encrypt(this.keys[key].toPem());
		});
		// for (const key in this.keys)
		// 	data[key] = this.encrypt(this.keys[key].toPem());

		try {
			fs.writeFileSync(target, JSON.stringify(data));
		} catch (error) {
			throw error;
		}
	}

	extractKeys() {
		const keys = {};
		const jsonData = JSON.parse(this.keysContent);

		Object.keys(jsonData).forEach((key) => {
			keys[key] = new Key(this.decrypt(jsonData[key]));
		});
		// for (const key in jsonData)
		// 	keys[key] = new Key(this.decrypt(jsonData[key]));


		return keys;
	}

	async download(order) {
		const res = await this.ebicsRequest(order.toXML());

		const ttt = res.toXML();										// TODO: keep this for debugging purposes

		order.transactionId = res.transactionId();

		if (res.isSegmented() && res.isLastSegment()) {
			const receipt = await this.ebicsRequest(order.toReceiptXML());

			const receiptXML = order.toReceiptXML(); 					// TODO: keep this for debugging purposes
			const rX = receipt.toXML(); 								// TODO: keep this for debugging purposes
		}

		return res.orderData();
	}

	async upload(order) {
		let res = await this.ebicsRequest(order.toXML());
		order.transactionId = res.transactionId();
		// const orderId = res.orderId();

		res = await this.ebicsRequest(order.toTransferXML());

		return res.transactionId();
	}

	async downloadAndUnzip(order) { // eslint-disable-line

	}

	ebicsRequest(order) {
		return new Promise((resolve, reject) => {
			$request.post({
				url: this.url,
				body: XMLSign.go(this, order),
				headers: { 'content-type': 'text/xml;charset=UTF-8' },
			}, (err, res, data) => (err ? reject(err) : resolve(ParseResponse.go(this, data))));
		});
	}

	async INI() {
		return this.ebicsRequest((new EBICSINI(this)).toXML());
	}

	async HIA() {
		return this.ebicsRequest((new EBICSHIA(this)).toXML());
	}

	async HPB() {
		const data = await this.download(new EBICSHPB(this));

		const doc = new DOMParser().parseFromString(data, 'text/xml');
		const sel = xpath.useNamespaces({ xmlns: 'urn:org:ebics:H004' });
		const keyNodes = sel('//xmlns:PubKeyValue', doc);
		// console.log(keyNodes);

		function xmlLastChild(node) {
			let y = node.lastChild;

			while (y.nodeType !== 1) y = y.previousSibling;

			return y;
		}

		for (let i = 0; i < keyNodes.length; i++) {
			const type = xmlLastChild(keyNodes[i].parentNode).textContent;
			const modulus = xpath.select("//*[local-name(.)='Modulus']", keyNodes[i])[0].textContent;
			const exponent = xpath.select("//*[local-name(.)='Exponent']", keyNodes[i])[0].textContent;

			const mod = new BN(Buffer.from(modulus, 'base64'), 2).toBuffer();
			const exp = utils.exponent.fromBase64(exponent);

			const bank = new NodeRSA();

			bank.importKey({ n: mod, e: exp }, 'components-public');

			this.keys[`${this.hostId}.${type}`] = new Key(bank);
		}

		return [this.bankX(), this.bankE()];
	}

	HKD() {
		return this.download(new EBICSHKD(this));
	}

	HAA() {
		return this.download(new EBICSHAA(this));
	}

	HTD() {
		return this.download(new EBICSHTD(this));
	}

	HAC(from = null, to = null) {
		return this.download(new EBICSHAC(this, from, to));
	}

	C52(from, to) {
		return this.downloadAndUnzip(new EBICSC52(this, from, to));
	}
};
